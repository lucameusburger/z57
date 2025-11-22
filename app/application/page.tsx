"use client";

import { AlertCircle, Check, CornerRightUp, Upload, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Category = "selling" | "exhibit_only";

const WIEN_DAY = { value: "2025-12-06", label: "Wien 06.12" };
const FELDKIRCH_DAYS = [
    { value: "2025-12-18", label: "18.12. Feldkirch" },
    { value: "2025-12-19", label: "19.12. Feldkirch" },
    { value: "2025-12-20", label: "20.12. Feldkirch" },
];

const ALL_DAYS = [WIEN_DAY, ...FELDKIRCH_DAYS];

export default function ApplicationPage() {
    const [category, setCategory] = useState<Category>("selling");
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [daysSelfSelling, setDaysSelfSelling] = useState<Record<string, "ja" | "nein" | null>>({});
    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        website: "",
        instagram: "",
        space_needs: "",
        comment: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [willingToHelp, setWillingToHelp] = useState(false);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [fileSizeErrors, setFileSizeErrors] = useState<string[]>([]);

    // File size limits (in bytes)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB per file
    const MAX_TOTAL_SIZE = 10 * 1024 * 1024; // 10MB total

    // Create preview URLs for images
    useEffect(() => {
        const previews = images.map((file) => URL.createObjectURL(file));
        setImagePreviews(previews);

        // Cleanup preview URLs when component unmounts or images change
        return () => {
            previews.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [images]);

    const toggleWien = () => {
        const wienValue = WIEN_DAY.value;
        if (selectedDays.includes(wienValue)) {
            setSelectedDays((prev) => prev.filter((d) => d !== wienValue));
            setDaysSelfSelling((prev) => {
                const updated = { ...prev };
                delete updated[wienValue];
                return updated;
            });
        } else {
            setSelectedDays((prev) => [...prev, wienValue]);
        }
        // Clear validation errors when user selects a day
        if (validationErrors.some(e => e.includes("Termin"))) {
            setValidationErrors((prev) => prev.filter(e => !e.includes("Termin")));
        }
    };

    const totalCost = useMemo(() => {
        const baseCost = (selectedDays.length * 30) + Object.values(daysSelfSelling).filter((value) => value === "nein").length * 20
        return Math.round(baseCost);
    }, [selectedDays, daysSelfSelling]);

    const rabatt = useMemo(() => {
        return (selectedDays.length === ALL_DAYS.length ? totalCost * 0.15 : 0);
    }, [selectedDays, totalCost]);

    // Check if all selected days have a yes/no toggle set
    const allTogglesSet = useMemo(() => {
        if (selectedDays.length === 0) return false;
        return selectedDays.every((day) => daysSelfSelling[day] !== null && daysSelfSelling[day] !== undefined);
    }, [selectedDays, daysSelfSelling]);

    // Only show price calculation if days are selected, all toggles are set, and category is "selling"
    const showPriceCalculation = category === "selling" && selectedDays.length > 0 && allTogglesSet;

    // Check if at least one day has "nein" selected in exhibit_only mode
    const hasNeinInExhibitOnly = useMemo(() => {
        if (category !== "exhibit_only" || selectedDays.length === 0) return false;
        return Object.values(daysSelfSelling).some((value) => value === "nein");
    }, [category, selectedDays, daysSelfSelling]);

    const toggleFeldkirch = () => {
        const feldkirchValues = FELDKIRCH_DAYS.map((d) => d.value);
        const allSelected = feldkirchValues.every((val) => selectedDays.includes(val));

        if (allSelected) {
            // Remove all Feldkirch days
            setSelectedDays((prev) => prev.filter((d) => !feldkirchValues.includes(d)));
            setDaysSelfSelling((prev) => {
                const updated = { ...prev };
                feldkirchValues.forEach((val) => delete updated[val]);
                return updated;
            });
        } else {
            // Add all Feldkirch days
            setSelectedDays((prev) => {
                const newDays = [...prev];
                feldkirchValues.forEach((val) => {
                    if (!newDays.includes(val)) {
                        newDays.push(val);
                    }
                });
                return newDays;
            });
        }
        // Clear validation errors when user selects a day
        if (validationErrors.some(e => e.includes("Termin"))) {
            setValidationErrors((prev) => prev.filter(e => !e.includes("Termin")));
        }
    };

    const toggleDaySelfSelling = (day: string, value: "ja" | "nein") => {
        setDaysSelfSelling((prev) => {
            const currentValue = prev[day];
            // If clicking the same value, set to null (unselected)
            if (currentValue === value) {
                const updated = { ...prev };
                updated[day] = null;
                return updated;
            }
            // Otherwise, set the new value
            return { ...prev, [day]: value };
        });
        // Clear validation errors when user makes a selection
        if (validationErrors.some(e => e.includes("ausgewählten Termine"))) {
            setValidationErrors((prev) => prev.filter(e => !e.includes("ausgewählten Termine")));
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files).filter((file) => file.type.startsWith("image/"));
            const sizeErrors: string[] = [];

            // Check file sizes
            newFiles.forEach((file) => {
                if (file.size > MAX_FILE_SIZE) {
                    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
                    sizeErrors.push(`${file.name} ist zu groß (${sizeInMB} MB). Maximale Dateigröße: 5 MB.`);
                }
            });

            // Check total size including existing images
            const existingTotalSize = images.reduce((sum, img) => sum + img.size, 0);
            const newTotalSize = newFiles.reduce((sum, file) => sum + file.size, 0);
            const totalSize = existingTotalSize + newTotalSize;

            if (totalSize > MAX_TOTAL_SIZE) {
                const totalSizeInMB = (totalSize / (1024 * 1024)).toFixed(2);
                sizeErrors.push(`Die Gesamtgröße aller Bilder (${totalSizeInMB} MB) überschreitet das Limit von 10 MB.`);
            }

            if (sizeErrors.length > 0) {
                setFileSizeErrors(sizeErrors);
                // Reset input so user can try again
                e.target.value = "";
                return;
            }

            // Clear file size errors if validation passes
            setFileSizeErrors([]);
            setImages((prev) => [...prev, ...newFiles]);
            // Clear validation errors when user uploads images
            if (validationErrors.some(err => err.includes("Bild"))) {
                setValidationErrors((prev) => prev.filter(err => !err.includes("Bild")));
            }
        }
        // Reset input so same file can be selected again
        e.target.value = "";
    };

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Reset validation errors
        setValidationErrors([]);
        const errors: string[] = [];

        // Validate that at least one day is selected
        if (selectedDays.length === 0) {
            errors.push("Bitte wählen Sie mindestens einen Termin aus.");
        }

        // Validate that all selected days have a Ja/Nein selection
        if (selectedDays.length > 0) {
            const missingSelections = selectedDays.filter(
                (day) => !daysSelfSelling[day] || daysSelfSelling[day] === null
            );
            if (missingSelections.length > 0) {
                errors.push("Bitte wählen Sie für alle ausgewählten Termine 'Ja' oder 'Nein' aus.");
            }
        }

        // Validate that at least one image is uploaded
        if (images.length === 0) {
            errors.push("Bitte laden Sie mindestens ein Bild hoch.");
        }

        // Validate total file size
        const totalSize = images.reduce((sum, img) => sum + img.size, 0);
        if (totalSize > MAX_TOTAL_SIZE) {
            const totalSizeInMB = (totalSize / (1024 * 1024)).toFixed(2);
            errors.push(`Die Gesamtgröße aller Bilder (${totalSizeInMB} MB) überschreitet das Limit von 10 MB. Bitte entfernen Sie einige Bilder.`);
        }

        // Validate that terms are accepted
        if (!termsAccepted) {
            errors.push("Bitte akzeptieren Sie die Teilnahmebedingungen.");
        }

        // If there are validation errors, show them and stop submission
        if (errors.length > 0) {
            setValidationErrors(errors);
            setSubmitStatus("error");
            // Scroll to first error
            setTimeout(() => {
                const firstError = document.querySelector('[data-validation-error]');
                firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus("idle");

        try {
            // Create FormData to send to API route
            const submitFormData = new FormData();
            submitFormData.append("name", formData.name);
            submitFormData.append("email", formData.email);
            submitFormData.append("category", category);
            if (formData.website) submitFormData.append("website", formData.website);
            if (formData.instagram) submitFormData.append("instagram", formData.instagram);
            if (formData.space_needs) submitFormData.append("space_needs", formData.space_needs);
            if (formData.comment) submitFormData.append("comment", formData.comment);
            if (willingToHelp) submitFormData.append("willing_to_help", "true");
            submitFormData.append("days", JSON.stringify(selectedDays));

            // Filter out null values and only include days that are selected
            const daysSelfSellingFiltered = Object.fromEntries(
                Object.entries(daysSelfSelling).filter(
                    ([day, value]) => selectedDays.includes(day) && value !== null
                )
            );
            submitFormData.append("days_self_selling", JSON.stringify(daysSelfSellingFiltered));

            // Append images
            images.forEach((image, index) => {
                submitFormData.append(`images[${index}]`, image);
            });

            const response = await fetch("/api/application", {
                method: "POST",
                body: submitFormData,
            });

            if (!response.ok) {
                // Check for size limit errors first (413 status code)
                if (response.status === 413) {
                    throw new Error("Die Dateien sind zu groß. Bitte reduzieren Sie die Dateigröße und versuchen Sie es erneut.");
                }

                let errorData;
                try {
                    errorData = await response.json();
                } catch {
                    throw new Error("Fehler beim Absenden der Bewerbung. Bitte versuchen Sie es erneut.");
                }

                // Check for size limit errors in the error response
                const errorMessage = errorData.error || "Failed to submit application";
                if (errorMessage.toLowerCase().includes("too large") || errorMessage.toLowerCase().includes("size limit") || errorMessage.toLowerCase().includes("zu groß")) {
                    throw new Error("Die Dateien sind zu groß. Bitte reduzieren Sie die Dateigröße und versuchen Sie es erneut.");
                }

                throw new Error(errorMessage);
            }

            setSubmitStatus("success");
            // Reset form
            setFormData({
                name: "",
                email: "",
                website: "",
                instagram: "",
                space_needs: "",
                comment: "",
            });
            setSelectedDays([]);
            setDaysSelfSelling({});
            setImages([]);
            setCategory("selling");
            setTermsAccepted(false);
            setWillingToHelp(false);
            setValidationErrors([]);
        } catch (error) {
            console.error("Submission error:", error);
            setSubmitStatus("error");
            // Add error to validation errors to display it
            const errorMessage = error instanceof Error ? error.message : "Fehler beim Absenden. Bitte versuchen Sie es erneut.";
            setValidationErrors([errorMessage]);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {/* Fullscreen Success Screen */}
            {submitStatus === "success" && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
                    <div className="flex flex-col items-center justify-center gap-8 px-4">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full animate-bounce flex items-center justify-center">
                            <svg id="Ebene_1" data-name="Ebene 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 445.54 441.24">
                                <polygon className="fill-black" points="204.34 0 195.79 116.33 0 183.04 22.73 407.19 96.51 407.19 109.26 269.57 177.36 280.93 197.22 438.43 261.07 441.24 282.37 279.5 337.72 258.2 383.13 387.33 445.54 387.33 445.54 12.75 204.34 0" />
                            </svg>
                        </div>
                        <div className="text-center">
                            <h2 className="text-3xl md:text-5xl font-bold mb-4">Bewerbung erfolgreich eingereicht!</h2>
                            <p className="text-xl md:text-2xl text-foreground/80">Vielen Dank für Ihre Bewerbung.</p>
                        </div>
                        <a
                            href="/"
                            className="border-foreground border rounded-full px-8 py-4 bg-foreground text-background hover:bg-background hover:text-foreground transition-colors text-xl font-bold"
                        >
                            Zur Startseite
                        </a>
                    </div>
                </div>
            )}

            <div className="min-h-screen flex flex-col gap-8 px-4 md:px-8 py-8 ">
                <div className="flex items-start flex-col gap-4 justify-start relative">
                    <div className="flex justify-between items-center w-full border-t border-foreground pt-4">
                        <span className="text-2xl md:text-5xl">z57 Wintermarkt Bewerbung</span>
                        <a href="/">
                            <CornerRightUp className="w-6 h-6" />
                        </a>
                    </div>

                    <p className="flex flex-col gap-6 md:flex-row">
                        <span className="flex-1">Diesen Winter laden wir erneut Designer:innen und Künstler:innen dazu ein, am 06.12. bei uns in der Zieglergasse 57 am Dach auszustellen und ihre Werke zu verkaufen. Zusätzlich gibt es die Möglichkeit von 18.-20.12. Teil des z57 Wintermakts im Innenhof der Kreuzgasse 16 im Herzen der Feldkircher Innenstadt (Vorarlberg) nur wenige Schritte entfernt vom gut besuchten Christkindlmarkt zu sein. Wir kümmern uns um die gesamte Organisation und Bewerbung der Veranstaltungen, um Punsch und Musik und bei Bedarf um den Verkauf der Werke, den Transport von Wien nach Vorarlberg und um einen Rücktransport der nicht verkauften Objekte in der ersten Jännerwoche 2026.</span>
                        <span className="flex-1">Für jeden Tag gibt es eine Grundgebühr von 30€ und zusätzlich nochmal 30€ optional für jeden Tag an dem wir den Verkauf und die Verantwortung für deine Objekte übernehmen. Wer bei allen Terminen dabei ist bekommt 15% Ermäßigung. Gerne berücksichtigen wir Einzelfälle und abweichende Anfragen individuell.</span>
                    </p>

                    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-8 max-w-4xl">
                        {/* Category Toggle Cards */}
                        <div className="flex flex-col gap-4">
                            <label className="text-xl font-bold">Kategorie</label>
                            <div className="flex gap-4 flex-col md:flex-row">
                                <button
                                    type="button"
                                    onClick={() => setCategory("selling")}
                                    className={`flex-1 border-foreground transition-colors w-full flex flex-col gap-4 justify-between border overflow-hidden relative rounded-full p-6 ${category === "selling"
                                        ? "bg-foreground text-background"
                                        : "bg-background text-foreground hover:bg-foreground hover:text-background"
                                        }`}
                                >
                                    <span className="text-xl font-bold">Verkauf</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setCategory("exhibit_only")}
                                    className={`flex-1 border-foreground transition-colors w-full flex flex-col gap-4 justify-between border overflow-hidden relative rounded-full p-6 ${category === "exhibit_only"
                                        ? "bg-foreground text-background"
                                        : "bg-background text-foreground hover:bg-foreground hover:text-background"
                                        }`}
                                >
                                    <span className="text-xl font-bold">Ausstellung</span>
                                </button>
                            </div>
                        </div>

                        {/* Name */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="name" className="text-xl font-bold">
                                Name *
                            </label>
                            <input
                                type="text"
                                id="name"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="border-foreground border rounded-full px-6 py-4 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground"
                            />
                        </div>

                        {/* Email */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="email" className="text-xl font-bold">
                                Email *
                            </label>
                            <input
                                type="email"
                                id="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="border-foreground border rounded-full px-6 py-4 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground"
                            />
                        </div>

                        {/* Website */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="website" className="text-xl font-bold">
                                Website (falls vorhanden)
                            </label>
                            <input
                                type="url"
                                id="website"
                                value={formData.website}
                                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                className="border-foreground border rounded-full px-6 py-4 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground"
                                placeholder="https://example.com"
                            />
                        </div>

                        {/* Instagram */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="instagram" className="text-xl font-bold">
                                Instagram (falls vorhanden)
                            </label>
                            <input
                                type="text"
                                id="instagram"
                                value={formData.instagram}
                                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                                className="border-foreground border rounded-full px-6 py-4 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground"
                                placeholder="@username"
                            />
                        </div>

                        {/* Image Upload */}
                        <div className="flex flex-col gap-4" data-validation-error={validationErrors.some(e => e.includes("Bild")) || fileSizeErrors.length > 0}>
                            <label className="text-xl font-bold">
                                Fotos der Werke oder Arbeitsproben für die Promotion der Veranstaltungen inkl. Fotocredits <span className="font-bold">*</span>
                            </label>
                            <div className="flex flex-col gap-4">
                                <label
                                    htmlFor="images"
                                    className={`border-foreground border rounded-full px-6 py-4 bg-background text-foreground hover:bg-foreground hover:text-background transition-colors cursor-pointer flex items-center gap-4 ${validationErrors.some(e => e.includes("Bild")) || fileSizeErrors.length > 0 ? "border-red-500" : ""}`}
                                >
                                    <Upload className="w-6 h-6" />
                                    <span>Bilder hochladen</span>
                                </label>
                                <input
                                    type="file"
                                    id="images"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                                {fileSizeErrors.length > 0 && (
                                    <div className="border-red-500 border rounded-full px-6 py-4 bg-red-50 text-red-700 flex items-start gap-4">
                                        <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
                                        <div className="flex flex-col gap-2 flex-1">
                                            {fileSizeErrors.map((error, index) => (
                                                <p key={index} className="text-lg">{error}</p>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {images.length > 0 && (
                                    <div className="flex flex-wrap gap-4">
                                        {images.map((image, index) => {
                                            const sizeInMB = (image.size / (1024 * 1024)).toFixed(2);
                                            return (
                                                <div
                                                    key={index}
                                                    className="relative border-foreground border rounded-3xl overflow-hidden bg-background w-full md:w-48 aspect-square"
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            removeImage(index);
                                                            // Clear file size errors when removing images
                                                            if (fileSizeErrors.length > 0) {
                                                                setFileSizeErrors([]);
                                                            }
                                                        }}
                                                        className="absolute top-2 right-2 z-10 bg-foreground text-background p-1 hover:opacity-80"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                    {imagePreviews[index] && (
                                                        <img
                                                            src={imagePreviews[index]}
                                                            alt={image.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    )}
                                                    <div className="absolute bottom-0 left-0 right-0 bg-foreground text-background text-xs p-2 truncate">
                                                        {image.name} ({sizeInMB} MB)
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>


                        {/* Space Needs */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="space_needs" className="text-xl font-bold">
                                Wie viel Platz wird benötigt? (Maßangabe mit Länge x Breite in cm)
                            </label>
                            <textarea
                                id="space_needs"
                                value={formData.space_needs}
                                onChange={(e) => setFormData({ ...formData, space_needs: e.target.value })}
                                rows={3}
                                className="border-foreground border rounded-3xl px-6 py-4 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground resize-none"
                                placeholder="z.B. zwei Tische oder 2m x 1m"
                            />
                        </div>

                        {/* Comment */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="comment" className="text-xl font-bold">
                                Kommentar (optional)
                            </label>
                            <textarea
                                id="comment"
                                value={formData.comment}
                                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                                rows={4}
                                className="border-foreground border rounded-3xl px-6 py-4 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground resize-none"
                                placeholder="Weitere Informationen oder Anmerkungen..."
                            />
                        </div>

                        {/* Days Selection */}
                        <div className="flex flex-col gap-4" data-validation-error={validationErrors.some(e => e.includes("Termin"))}>
                            <label className="text-xl font-bold">
                                {category === "exhibit_only"
                                    ? "Ich stelle an folgenden Terminen aus"
                                    : "Ich nehme an folgenden Terminen teil"} <span className="font-bold">*</span>
                            </label>
                            <div className="flex flex-wrap gap-4">
                                <button
                                    type="button"
                                    onClick={toggleWien}
                                    className={`border-foreground w-full md:w-auto transition-colors py-3 px-8 rounded-full border flex items-center gap-3 justify-between ${selectedDays.includes(WIEN_DAY.value)
                                        ? "bg-foreground text-background"
                                        : "bg-background text-foreground hover:bg-foreground hover:text-background"
                                        } ${validationErrors.some(e => e.includes("Termin")) ? "border-red-500" : ""}`}
                                >
                                    <span className="text-xl font-bold">{WIEN_DAY.label}</span>
                                    {selectedDays.includes(WIEN_DAY.value) && (
                                        <Check className="w-5 h-5 stroke-[3] -mr-2" />
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={toggleFeldkirch}
                                    className={`border-foreground w-full md:w-auto transition-colors py-3 px-8 rounded-full border flex items-center gap-3 justify-between ${FELDKIRCH_DAYS.every((d) => selectedDays.includes(d.value))
                                        ? "bg-foreground text-background"
                                        : "bg-background text-foreground hover:bg-foreground hover:text-background"
                                        } ${validationErrors.some(e => e.includes("Termin")) ? "border-red-500" : ""}`}
                                >
                                    <span className="text-xl font-bold">Feldkirch 18.-20-12</span>
                                    {FELDKIRCH_DAYS.every((d) => selectedDays.includes(d.value)) && (
                                        <Check className="w-5 h-5 stroke-[3] -mr-2" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Days Self Selling */}
                        {selectedDays.length > 0 && (
                            <div className="flex flex-col gap-4" data-validation-error={validationErrors.some(e => e.includes("ausgewählten Termine"))}>
                                <label className={`text-xl font-bold ${validationErrors.some(e => e.includes("ausgewählten Termine")) ? "text-red-500" : ""}`}>
                                    {category === "exhibit_only"
                                        ? "Ich bin an folgenden Tagen selbst vorort und übernehme die Verantwortung für meine Objekte"
                                        : "Ich bin an folgenden Tagen selbst vorort und übernehme den Verkauf und die Verantwortung für meine Objekte"} <span className="font-bold">*</span>
                                </label>
                                <div className="flex flex-col gap-4">
                                    {selectedDays
                                        .sort()
                                        .map((day) => {
                                            const dayInfo = ALL_DAYS.find((d) => d.value === day);
                                            const dayLabel = dayInfo?.label || day;
                                            const currentValue = daysSelfSelling[day] || null;
                                            const hasError = validationErrors.some(e => e.includes("ausgewählten Termine")) && !currentValue;

                                            return (
                                                <div key={day} className="flex flex-col gap-2">
                                                    <span className={`text-lg font-semibold ${hasError ? "text-red-500" : ""}`}>{dayLabel}</span>
                                                    <div className="flex gap-4">
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleDaySelfSelling(day, "ja")}
                                                            className={`transition-colors px-6 py-4 rounded-full border flex-1 ${currentValue === "ja"
                                                                ? "bg-foreground text-background border-foreground"
                                                                : hasError
                                                                    ? "bg-background text-foreground border-red-500 hover:bg-red-50"
                                                                    : "bg-background text-foreground border-foreground hover:bg-foreground hover:text-background"
                                                                }`}
                                                        >
                                                            Ja
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleDaySelfSelling(day, "nein")}
                                                            className={`transition-colors px-6 py-4 rounded-full border flex-1 ${currentValue === "nein"
                                                                ? "bg-foreground text-background border-foreground"
                                                                : hasError
                                                                    ? "bg-background text-foreground border-red-500 hover:bg-red-50"
                                                                    : "bg-background text-foreground border-foreground hover:bg-foreground hover:text-background"
                                                                }`}
                                                        >
                                                            Nein
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>
                        )}

                        {category === "exhibit_only" && selectedDays.length > 0 && (
                            <>
                                <p>
                                    Hinweis:
                                    Die Ausstellung ist kostenlos.
                                    {hasNeinInExhibitOnly && (
                                        <span className=" text-foreground/80">
                                            Wir übernehmen keine Verantwortung für die Sicherheit der Objekte an Tagen, an denen du nicht vor Ort bist. Wir können gerne individuelle Lösungen besprechen.
                                        </span>
                                    )}
                                </p>
                            </>
                        )}

                        {showPriceCalculation && (
                            <>
                                <p >
                                    Anhand deiner Angaben verrechnen wir die folgenden Kosten:
                                    <br />
                                    <span className="">{totalCost}€</span> {rabatt > 0 ? `- 15% Rabatt` : ''} = <span className="font-bold ml-2">{totalCost - rabatt}€</span>
                                </p>

                                <p>
                                    <span className="font-bold mr-2">*</span>Für jeden Tag entseht eine Grundgebühr von 30€. Jeden Tag and dem wir den Verkauf und Verantwortung für deine Objekte übernehmen, verrechnen wir 40€. Wenn du an allen Terminen teilnimmst, erhältst du 15% Rabatt. Einzelfälle werden individuell betrachtet.
                                </p>
                            </>
                        )}

                        <p>
                            <span className="font-bold mr-2">*</span>Wir kümmern uns um die gesamte Organisation und Bewerbung der Veranstaltungen, um Punsch und Musik und bei Bedarf um den Verkauf der Werke und den Transport von Wien nach Vorarlberg in KW 51 und um einen Rücktransport der nicht verkauften Objekte in der ersten Jännerwoche 2026.
                        </p>

                        {/* Willing to Help Checkbox */}
                        <div className="flex items-start gap-4">
                            <div className="relative flex-shrink-0">
                                <input
                                    type="checkbox"
                                    id="willing_to_help"
                                    checked={willingToHelp}
                                    onChange={(e) => setWillingToHelp(e.target.checked)}
                                    className="sr-only"
                                />
                                <label
                                    htmlFor="willing_to_help"
                                    className={`flex items-center justify-center w-12 h-12 border-2 border-foreground rounded-full cursor-pointer transition-all duration-200 ${willingToHelp
                                        ? "bg-foreground text-background"
                                        : "bg-background text-foreground hover:bg-foreground/10"
                                        }`}
                                >
                                    {willingToHelp && (
                                        <Check className="w-6 h-6 stroke-[3]" />
                                    )}
                                </label>
                            </div>
                            <label htmlFor="willing_to_help" className="cursor-pointer flex-1 leading-relaxed">
                                Ich wäre bereit, beim Wintermarkt zusätzliche Aufgaben zu übernehmen (z. B. beim Aufbau, Verkauf, in der Betreuung oder beim Punschstand) gegen eine reduzierte oder kostenfreie Teilnahme.
                            </label>
                        </div>

                        {/* Terms and Conditions Checkbox */}
                        <div className="flex items-start gap-4" data-validation-error={validationErrors.some(e => e.includes("Teilnahmebedingungen"))}>
                            <div className="relative flex-shrink-0">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    required
                                    checked={termsAccepted}
                                    onChange={(e) => {
                                        setTermsAccepted(e.target.checked);
                                        // Clear validation errors when user accepts terms
                                        if (e.target.checked && validationErrors.some(err => err.includes("Teilnahmebedingungen"))) {
                                            setValidationErrors((prev) => prev.filter(err => !err.includes("Teilnahmebedingungen")));
                                        }
                                    }}
                                    className="sr-only"
                                />
                                <label
                                    htmlFor="terms"
                                    className={`flex items-center justify-center w-12 h-12 border-2 rounded-full cursor-pointer transition-all duration-200 ${termsAccepted
                                        ? "bg-foreground text-background border-foreground"
                                        : validationErrors.some(e => e.includes("Teilnahmebedingungen"))
                                            ? "bg-background text-foreground border-red-500 hover:bg-red-50"
                                            : "bg-background text-foreground border-foreground hover:bg-foreground/10"
                                        }`}
                                >
                                    {termsAccepted && (
                                        <Check className="w-6 h-6 stroke-[3]" />
                                    )}
                                </label>
                            </div>
                            <label htmlFor="terms" className={`cursor-pointer flex-1 leading-relaxed ${validationErrors.some(e => e.includes("Teilnahmebedingungen")) ? "text-red-500" : ""}`}>
                                Mit dem Absenden meiner Bewerbung bestätige ich, dass ich im Falle einer Zusage verbindlich am z57 Wintermarkt zu den angegebenen Terminen teilnehme und die genannten Preiskonditionen akzeptiere. Darüber hinaus stimme ich der Verwendung des Bildmaterials im Rahmen der Veranstaltungsbewerbung zu, sofern dabei die entsprechenden Fotocredits sowie die Nennung und Markierung der*des Ausstellerin erfolgen.
                            </label>
                        </div>

                        {/* Validation Errors */}
                        {validationErrors.length > 0 && (
                            <div className="border-red-500 border rounded-full px-6 py-4 bg-red-50 text-red-700 flex items-start gap-4">
                                <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
                                <div className="flex flex-col gap-2 flex-1">
                                    {validationErrors.map((error, index) => (
                                        <p key={index} className="text-lg">{error}</p>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="border-foreground border rounded-full px-6 py-4 bg-foreground text-background hover:bg-background hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xl font-bold"
                        >
                            {isSubmitting ? "Wird gesendet..." : "Bewerbung absenden"}
                        </button>

                        {/* Status Messages */}
                        {submitStatus === "error" && (
                            <div className="border-foreground border rounded-full px-6 py-4 bg-background text-foreground">
                                <p className="text-xl">Fehler beim Absenden. Bitte versuchen Sie es erneut.</p>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </>
    );
}

