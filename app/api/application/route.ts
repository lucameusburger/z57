import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const directusUrl = process.env.DIRECTUS_URL || "";
    const accessToken = process.env.DIRECTUS_TOKEN || "";

    if (!directusUrl || !accessToken) {
      return NextResponse.json(
        { error: "Directus configuration missing" },
        { status: 500 }
      );
    }

    const formData = await request.formData();

    // Extract form fields
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const category = formData.get("category") as string;
    const website = formData.get("website") as string | null;
    const instagram = formData.get("instagram") as string | null;
    const space_needs = formData.get("space_needs") as string | null;
    const comment = formData.get("comment") as string | null;
    const daysStr = formData.get("days") as string;
    const days = daysStr ? JSON.parse(daysStr) : [];
    const daysSelfSellingStr = formData.get("days_self_selling") as string | null;
    const days_self_selling = daysSelfSellingStr ? JSON.parse(daysSelfSellingStr) : null;

    // Get image files - extract all files with keys starting with "images["
    const imageFiles: File[] = [];
    const allEntries = Array.from(formData.entries());
    
    for (const [key, value] of allEntries) {
      if (key.startsWith("images[") && value instanceof File) {
        imageFiles.push(value);
      }
    }
    
    // Sort by index to maintain order (extract index from key like "images[0]")
    imageFiles.sort((a, b) => {
      // Find the index from the original entries
      const aKey = allEntries.find(([k, v]) => v === a)?.[0] || "";
      const bKey = allEntries.find(([k, v]) => v === b)?.[0] || "";
      const aIndex = parseInt(aKey.match(/\[(\d+)\]/)?.[1] || "0");
      const bIndex = parseInt(bKey.match(/\[(\d+)\]/)?.[1] || "0");
      return aIndex - bIndex;
    });

    // Upload all images to Directus in parallel and collect their IDs
    // Try to force JSON response by adding Accept header and fields parameter
    const uploadPromises = imageFiles.map(async (image) => {
      const uploadFormData = new FormData();
      uploadFormData.append("folder", "5226c09a-8033-4fcc-b15f-7618dcf1d476");
      uploadFormData.append("file", image);

      // Request JSON response - try with fields parameter to force JSON
      const uploadResponse = await fetch(`${directusUrl}/files?access_token=${accessToken}`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
        },
        body: uploadFormData,
      });

      console.log("Upload Response:", uploadResponse);

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json().catch(() => ({}));
        throw new Error(`Failed to upload image: ${image.name} - ${errorData.errors?.[0]?.message || uploadResponse.statusText}`);
      }


      // Parse JSON response - Directus returns { data: { id: "...", ... } }
      const uploadData = await uploadResponse.json();

      console.log("Upload Data:", uploadData);
      
      if (!uploadData || !uploadData.data || !uploadData.data.id) {
        throw new Error(`Invalid response format for file: ${image.name}. Expected { data: { id: string } }, got: ${JSON.stringify(uploadData)}`);
      }
      
      return uploadData.data.id;
    });

    // Wait for all uploads to complete - use allSettled to handle partial failures
    const uploadResults = await Promise.allSettled(uploadPromises);
    
    // Extract successful uploads and log failures
    const uploadedImageIds: string[] = [];
    const failedUploads: string[] = [];
    
    uploadResults.forEach((result, index) => {
      if (result.status === "fulfilled" && result.value) {
        uploadedImageIds.push(result.value);
      } else {
        failedUploads.push(imageFiles[index].name);
        console.error(`Failed to upload ${imageFiles[index].name}:`, result.status === "rejected" ? result.reason : "No file ID returned");
      }
    });
    
    // If some uploads failed, we still continue but log a warning
    if (failedUploads.length > 0) {
      console.warn(`Warning: ${failedUploads.length} file(s) failed to upload: ${failedUploads.join(", ")}`);
    }
    
    // If no files were successfully uploaded, throw an error
    if (uploadedImageIds.length === 0) {
      throw new Error(`All file uploads failed. Please check Directus configuration to return JSON responses with file IDs.`);
    }

    // Then create the application as JSON with files array
    const applicationData: any = {
      name,
      email,
      category,
      website: website || null,
      instagram: instagram || null,
      space_needs: space_needs || null,
      comment: comment || null,
      days,
      days_self_selling: days_self_selling || null,
    };

    // Add images as array of file IDs (Directus handles many-to-many relations)
    if (uploadedImageIds.length > 0) {
      applicationData.images = uploadedImageIds.map((id) => ({ directus_files_id: id }));
    }

    console.log("Creating application with data:", JSON.stringify(applicationData, null, 2));

    const response = await fetch(
      `${directusUrl}/items/z57_applications?access_token=${accessToken}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(applicationData),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Directus API Error:", {
        status: response.status,
        statusText: response.statusText,
        errorText,
      });
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { raw: errorText };
      }
      
      return NextResponse.json(
        { 
          error: errorData.errors?.[0]?.message || errorData.message || "Failed to submit application",
          details: errorData 
        },
        { status: response.status }
      );
    }

    // Check if response has content before parsing JSON
    const contentType = response.headers.get("content-type");
    const responseText = await response.text();
    
    let data = null;
    if (responseText && contentType?.includes("application/json")) {
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.warn("Failed to parse response as JSON:", e);
      }
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error("Application submission error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

