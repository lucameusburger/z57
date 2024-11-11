import { StaticImageData } from "next/image";
import irisImage from "@/app/images/iris.jpg";
import liliImage from "@/app/images/lili.jpg";
import lucaImage from "@/app/images/luca.jpg";
import nikoImage from "@/app/images/niko.jpg";
import robertImage from "@/app/images/robert.jpg";
import stellaImage from "@/app/images/stella.jpg";
import victorImage from "@/app/images/victor.jpg";

export interface Member {
  name: string;
  image: StaticImageData;
  title: string;
  description: string;
  email: string;
  website?: string;
  instagram?: string;
  projects?: Project[];
}

export interface Project {
  name: string;
  url: string;
}

export const members: Member[] = [
  {
    name: "Robert Zanona",
    image: robertImage,
    title: "Architektur",
    description:
      "Robert’s Arbeitswelt lässt sich zwischen Architektur, Kunst und Event-Management verorten. Als Architekt arbeitet er mit Fokus auf nachhaltigem Innenausbau und Holzbau mit einem besonderen Händchen für Materialität und Form. Als Assistent eines österreichischen Künstlers und als Booker des Poolbar Festivals ist er genauso in der österreichischen Kunst und Musik-Szene zu finden. Als Mitbegründer von Z57 kümmert er sich in seiner freien Zeit am liebsten um den Gemeinschaftsgarten im Atelier, töpfert oder baut Keramiköfen.",
    email: "robert@example.com",
    website: "http://www.west68.at",
    instagram: "https://www.instagram.com/west68_rz/",
    projects: [
      {
        name: "Poolbar Festival",
        url: "https://poolbar.at",
      },
      {
        name: "west68",
        url: "http://www.west68.at",
      },
    ],
  },
  {
    name: "Lilian Furrer",
    image: liliImage,
    title: "Restauration",
    description: "Lilian ist Mitbegründerin von z57 und freiberufliche Konservatorin/Restauratorin und Industriedesignerin, die in beiden Bereichen interdisziplinär arbeitet. Mit ihrem Interesse für Materialität, kulturelles Erbe und innovatives Design arbeitet sie objekt- und forschungsbasiert für kulturelle Institutionen und Firmen. In ihrer Freizeit widmet sie sich am liebsten der Keramik im kleinen z57 Keramikstudio.",
    email: "lili@example.com",
    instagram: "https://www.instagram.com/lilian.marie.furrer/",
    projects: [
      {
        name: "Restauration Workshop",
        url: "https://poolbar.at",
      },
      {
        name: "IKEA Designweek",
        url: "asd",
      },
    ],
  },
  {
    name: "Luca Meusburger",
    image: lucaImage,
    title: "Webentwicklung",
    description: "Luca ist ein freiberuflicher Webentwickler und Designer, der mit modernen Technologien und aktuellen Standards arbeitet, um ästhetische und benutzerfreundliche digitale Lösungen zu schaffen. Sein Fokus liegt auf anspruchsvollen Projekten wie Dashboards und mobilen Apps, bei denen er sowohl die Frontend- und Backend-Entwicklung übernimmt als auch die Gestaltung von UI und UX. Viele seiner Arbeiten sind im Kultur- und Bildungsbereich angesiedelt.",
    email: "luca@example.com",
    instagram: "https://www.instagram.com/luca.meusburgee/",
    website: "https://meusburger.io",
    projects: [
      {
        name: "Austrian Jazz Award",
        url: "https://jazzpreis.at",
      },
      {
        name: "Poolbar Festival",
        url: "https://poolbar.at",
      },
      {
        name: "Amadeus Austrian Music Award",
        url: "https://aama.at",
      },
      {
        name: "Wissenschaftsverbund",
        url: "https://wissenschaftsverbund.org",
      },
    ],
  },
  {
    name: "Stella Kucher",
    image: stellaImage,
    title: "Grafik",
    description: "Stella ist freiberufliche Gestalterin, spezialisiert auf Branding, Ausstellungsgestaltung und Editorial Design. Mit einem starken Interesse für die Verbindung von Raum und Grafik arbeitet sie konzeptionell und kombiniert eine klare visuelle Sprache mit spielerischen Elementen. Ihre Kunden sind sowohl private Auftraggeber als auch Institutionen aus dem Kunst- und Kulturbereich.",
    email: "stellakucher@yahoo.de",
    instagram: "https://www.instagram.com/stellakuc",
    website: "https://stellarollnykucher.com/",
    projects: [
      {
        name: "Carl Auböck Ausstellung AZW",
        url: "https://www.azw.at/de/termin/vom-besteck-zur-fertighaussiedlung-der-architekt-und-designer-carl-auboeck/",
      },
      {
        name: "Asphalt Kollektiv",
        url: "https://fontsinuse.com/uses/63654/asphalt",
      },
    ],
  },
  {
    name: "Niko Havranek",
    image: nikoImage,
    title: "Fotografie",
    description: "Robert is a passionate Music lover and a big fan of the classical music. He is also a big fan of the new music and is always looking for new music to listen to. He is a huge fan of the new technology and is always looking for new technologies to learn. Robert is also a big fan of the new fashion and is always looking for new fashion to wear. Robert is also a big fan of the new food and is always looking for new food to eat.",
    email: "niko@example.com",
    instagram: "https://www.instagram.com/niko.havranek",
    website: "http://www.nikohavranek.com/",
    projects: [
      {
        name: "Fotografie Workshop",
        url: "https://poolbar.at",
      },
      {
        name: "Nailart Workshop",
        url: "https://poolbar.at",
      },
    ],
  },
  {
    name: "Iris Prassl",
    image: irisImage,
    title: "Nailart",
    description: "Iris ist eine freiberufliche Nail Designerin die sich durch ihre außergewöhnlichen und extravaganten Designs auszeichnet. Ihre Bandbreite erstreckt sich von übertriebenem Kitsch bis hin zu animalischen Claws. Neben ihrer täglichen Beschäftigung mit Nägeln gibt sie zudem Workshops bei denen die Teilnehmer*innen ihre eigenen Press On Nägel gestalten können.",
    email: "fest.genagelt@gmx.at",
    instagram: "https://www.instagram.com/fest.genagelt/",
    projects: [
      {
        name: "Austrian Fashion Association",
        url: "https://www.austrianfashionassociation.at/event/nailgasm-manikuere-mode-gesellschaft/",
      },
    ],
  },
  {
    name: "Victor Dölle",
    title: "Architektur",
    image: victorImage,
    description:
      "Victor ist freischaffender Architekt aus Berlin mit langjähriger Erfahrung in kollektiver Architekturpraxis und Innenausbau. Als Leiter des Architektur-Labors beim Poolbar Generator beweist er alljährlich seine Vermittlungskompetenz, während er als Bauleiter des Poolbar Festivals die Zusammenarbeit auf Augenhöhe mit über 20 Mitarbeitenden zu koordinieren vermag. Wer Victor nicht mit Akku-Schrauber sondern doch mal mit Kochlöffel erwischt, erahnt schnell seine ursprüngliche Erstausbildung aus Koch.",
    email: "victor@example.com",
    projects: [
      {
        name: "Architektur Workshop",
        url: "https://poolbar.at",
      },
      {
        name: "Benu Bestattung",
        url: "https://www.benu.at/",
      },
    ],
  },
];
