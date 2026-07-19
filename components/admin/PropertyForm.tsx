"use client";

import {
  ImagePlus,
  Loader2,
  MapPin,
  Trash2,
  UploadCloud,
  Video,
  X
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ChangeEvent,
  DragEvent,
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";
import { toast } from "sonner";

import { AppSelect } from "@/components/ui/app-select";
import { formatEnum } from "@/lib/utils";
import { type Property, type PropertyMedia } from "@/types";
import {
  ListingType,
  MediaType,
  NegotiationStatus,
  PriceFrequency,
  PropertyStatus
} from "@/types/enums";
import dynamic from "next/dynamic";

const MapPicker = dynamic(
  () => import("./MapPicker").then((mod) => mod.MapPicker),
  {
    ssr: false,
    loading: () => (
      <div className="h-75 w-full animate-pulse bg-slate-900 rounded-xl flex items-center justify-center text-slate-500 text-sm border border-slate-800">
        Initializing Interactive Map Engine...
      </div>
    )
  }
);

export type FormFieldDefinition = {
  label: string;
  name: string;
  type: "number" | "text" | "select" | "date";
  placeholder?: string;
  options?: { label: string; value: string }[];
};

export const CONDITIONAL_PROPERTY_FIELDS: Record<
  ListingType,
  FormFieldDefinition[]
> = {
  SALE: [
    {
      label: "Sale Price (₦)",
      name: "salePrice",
      type: "number",
      placeholder: "e.g. 150000000"
    },
    {
      label: "Negotiation Status",
      name: "negotiationStatus",
      type: "select",
      options: Object.values(NegotiationStatus).map((value) => ({
        value,
        label: formatEnum(value)
      }))
    },
    {
      label: "Title Type",
      name: "titleType",
      type: "text",
      placeholder: "e.g. C of O, Deed of Assignment, Governor's Consent"
    },
    {
      label: "Year Built",
      name: "yearBuilt",
      type: "number",
      placeholder: "e.g. 2022"
    },
    {
      label: "Number of Bedrooms",
      name: "bedrooms",
      type: "number",
      placeholder: "e.g. 4"
    },
    {
      label: "Number of Bathrooms",
      name: "bathrooms",
      type: "number",
      placeholder: "e.g. 5"
    },
    {
      label: "Property Internal Size (Sqm)",
      name: "sizeSqm",
      type: "number",
      placeholder: "e.g. 450"
    }
  ],
  RENTAL: [
    {
      label: "Rental Price (₦)",
      name: "rentalPrice",
      type: "number",
      placeholder: "e.g. 12000000"
    },
    {
      label: "Price Frequency",
      name: "priceFrequency",
      type: "select",
      options: Object.values(PriceFrequency).map((value) => ({
        value,
        label: formatEnum(value)
      }))
    },
    { label: "Available From", name: "availableFrom", type: "date" },
    {
      label: "Lease Term",
      name: "leaseTerm",
      type: "text",
      placeholder: "e.g. 1 year minimum"
    },
    {
      label: "Service Charge (₦)",
      name: "serviceCharge",
      type: "number",
      placeholder: "e.g. 1500000"
    },
    {
      label: "Caution Fee (₦)",
      name: "cautionFee",
      type: "number",
      placeholder: "e.g. 500000"
    },
    {
      label: "Furnished",
      name: "furnished",
      type: "select",
      placeholder: "Not specified",
      options: [
        { label: "Furnished", value: "true" },
        { label: "Unfurnished", value: "false" }
      ]
    },
    {
      label: "Pets Allowed",
      name: "petsAllowed",
      type: "select",
      placeholder: "Not specified",
      options: [
        { label: "Yes", value: "true" },
        { label: "No", value: "false" }
      ]
    },
    {
      label: "Property Internal Size (Sqm)",
      name: "sizeSqm",
      type: "number",
      placeholder: "e.g. 220"
    },
    { label: "Number of Bedrooms", name: "bedrooms", type: "number" },
    { label: "Number of Bathrooms", name: "bathrooms", type: "number" }
  ],
  LAND: [
    {
      label: "Sale Price (₦)",
      name: "salePrice",
      type: "number",
      placeholder: "e.g. 85000000"
    },
    {
      label: "Land Size (sqm)",
      name: "landSizeSqm",
      type: "number",
      placeholder: "e.g. 600"
    },
    {
      label: "Title Type",
      name: "titleType",
      type: "text",
      placeholder: "e.g. C of O, Deed of Assignment, Excision"
    },
    {
      label: "Zoning Type",
      name: "zoningType",
      type: "text",
      placeholder: "e.g. Residential, Commercial, Mixed Use"
    },
    {
      label: "Negotiation Status",
      name: "negotiationStatus",
      type: "select",
      options: Object.values(NegotiationStatus).map((value) => ({
        value,
        label: formatEnum(value)
      }))
    }
  ],
  DEVELOPMENT: [
    {
      label: "Starting Price (₦)",
      name: "salePrice",
      type: "number",
      placeholder: "e.g. 210000000"
    },
    {
      label: "Negotiation Status",
      name: "negotiationStatus",
      type: "select",
      options: Object.values(NegotiationStatus).map((value) => ({
        value,
        label: formatEnum(value)
      }))
    },
    {
      label: "Estimated Completion",
      name: "estimatedCompletion",
      type: "date"
    },
    {
      label: "Title Type",
      name: "titleType",
      type: "text",
      placeholder: "e.g. C of O, Governor's Consent"
    },
    {
      label: "Year Built",
      name: "yearBuilt",
      type: "number",
      placeholder: "e.g. 2024 (if partially complete)"
    },
    {
      label: "Property Internal Size (Sqm)",
      name: "sizeSqm",
      type: "number",
      placeholder: "e.g. 450"
    },
    { label: "Number of Bedrooms", name: "bedrooms", type: "number" },
    { label: "Number of Bathrooms", name: "bathrooms", type: "number" }
  ]
};

export type PropertyFormNavigationGuard = {
  isDirty: () => boolean;
  confirmLeave: (destination: string) => Promise<boolean>;
};

type PendingNavigation = {
  destination: string | "back";
  resolve?: (allowed: boolean) => void;
};

type PropertyFormProps = {
  property?: Property;
  onRegisterNavigationGuard?: (guard: PropertyFormNavigationGuard) => void;
};

type StagedMedia = {
  id: string;
  file: File;
  previewUrl: string;
  altText: string;
  mediaType: MediaType;
};

type UploadResponse = PropertyMedia & {
  success: boolean;
  error?: string;
};

interface NominatimSuggestion {
  lat: string;
  lon: string;
  display_name?: string;
  address?: {
    road?: string;
    house_number?: string;
    suburb?: string;
    neighbourhood?: string;
    city?: string;
    town?: string;
    village?: string;
    city_district?: string;
    county?: string;
    state?: string;
    country?: string;
    postcode?: string;
    quarter?: string;
    amenity?: string;
  };
}

function createId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function formatFileSize(size: number) {
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function getMediaLabel(mediaType: MediaType | `${MediaType}`) {
  if (mediaType === MediaType.TOUR) return "Tour video";
  if (mediaType === MediaType.VIDEO) return "Video";
  return "Image";
}

function getDefaultAltText(file: File) {
  return file.name.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ");
}

function formatDateForInput(dateVal: Date | string | undefined | null) {
  if (!dateVal) return "";
  const date = new Date(dateVal);
  if (isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

export function PropertyForm({
  property,
  onRegisterNavigationGuard
}: PropertyFormProps) {
  const router = useRouter();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const tourInputRef = useRef<HTMLInputElement>(null);
  const [formStatus, setFormStatus] = useState<string>("");
  const [mediaStatus, setMediaStatus] = useState<string>("");
  const [media, setMedia] = useState<PropertyMedia[]>(property?.media ?? []);
  const [staged, setStaged] = useState<StagedMedia[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [latitude, setLatitude] = useState<number | undefined>(
    property?.latitude ?? undefined
  );
  const [longitude, setLongitude] = useState<number | undefined>(
    property?.longitude ?? undefined
  );
  const [address, setAddress] = useState<string>(property?.address ?? "");
  const [landmark, setLandmark] = useState<string>(property?.landmark ?? "");
  const [title, setTitle] = useState<string>(property?.title ?? "");
  const [slug, setSlug] = useState<string>(property?.slug ?? "");
  const [city, setCity] = useState<string>(property?.city ?? "");
  const [lga, setLga] = useState<string>(property?.lga ?? "");
  const [stateName, setStateName] = useState<string>(
    property?.state ?? "Lagos"
  );
  const [country, setCountry] = useState<string>(
    property?.country ?? "Nigeria"
  );

  const suggestionsRef = useRef<HTMLDivElement>(null);

  const [listingType, setListingType] = useState<ListingType>(
    (property?.listingType as ListingType) ?? ListingType.SALE
  );
  const [currentProperty, setCurrentProperty] = useState<Property | undefined>(
    property
  );
  const isEditing = Boolean(currentProperty);

  // Adjust state during render when property changes to avoid cascading renders
  const [prevProperty, setPrevProperty] = useState<Property | undefined>(
    property
  );
  if (property !== prevProperty) {
    setPrevProperty(property);
    setCurrentProperty(property);
    if (property) {
      setTitle(property.title ?? "");
      setSlug(property.slug ?? "");
      setCity(property.city ?? "");
      setLga(property.lga ?? "");
      setStateName(property.state ?? "Lagos");
      setCountry(property.country ?? "Nigeria");
      if (property.media) {
        setMedia(property.media);
      }
    }
  }

  const hasTourVideo =
    media.some((item) => item.mediaType === MediaType.TOUR) ||
    staged.some((item) => item.mediaType === MediaType.TOUR);

  const [isDirty, setIsDirty] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const pendingNavigationRef = useRef<PendingNavigation | null>(null);

  const handleLocationChange = useCallback(
    (
      lat: number,
      lng: number,
      reverseGeocodedAddress: string,
      addressDetails?: NominatimSuggestion["address"],
      isInitial?: boolean
    ) => {
      setLatitude(lat);
      setLongitude(lng);
      if (!isInitial) {
        setIsDirty(true);
      }
      if (reverseGeocodedAddress) {
        setAddress((prev) => {
          if (!prev) {
            if (!isInitial) setIsDirty(true);
            return reverseGeocodedAddress;
          }
          return prev;
        });
      }

      if (addressDetails) {
        const suggestionCity =
          addressDetails.city ||
          addressDetails.town ||
          addressDetails.village ||
          addressDetails.city_district ||
          "";
        if (suggestionCity) {
          setCity(suggestionCity);
        }

        const suggestionLga = addressDetails.city_district || addressDetails.county || "";
        if (suggestionLga) {
          setLga(suggestionLga);
        }

        const suggestionState = addressDetails.state || "";
        if (suggestionState) {
          const cleanState = suggestionState.replace(/\s+State$/i, "");
          setStateName(cleanState);
        }

        const suggestionCountry = addressDetails.country || "";
        if (suggestionCountry) {
          setCountry(suggestionCountry);
        }

        const area =
          addressDetails.suburb ||
          addressDetails.neighbourhood ||
          addressDetails.quarter ||
          addressDetails.amenity ||
          "";
        if (area) {
          setLandmark(area);
        }
      }
    },
    []
  );

  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<
    NominatimSuggestion[]
  >([]);

  // Close suggestions dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setLocationSuggestions([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const applySuggestedLocation = useCallback(
    (suggestion: NominatimSuggestion) => {
      const lat = parseFloat(suggestion.lat);
      const lon = parseFloat(suggestion.lon);
      setLatitude(lat);
      setLongitude(lon);
      setIsDirty(true);

      const addrObj = suggestion.address;
      if (addrObj) {
        // 1. Determine City
        const suggestionCity =
          addrObj.city ||
          addrObj.town ||
          addrObj.village ||
          addrObj.city_district ||
          "";
        if (suggestionCity) {
          setCity(suggestionCity);
        }

        // Determine LGA
        const suggestionLga = addrObj.city_district || addrObj.county || "";
        if (suggestionLga) {
          setLga(suggestionLga);
        }

        // 2. Determine State
        const suggestionState = addrObj.state || "";
        if (suggestionState) {
          const cleanState = suggestionState.replace(/\s+State$/i, "");
          setStateName(cleanState);
        }

        // 3. Determine Country
        const suggestionCountry = addrObj.country || "";
        if (suggestionCountry) {
          setCountry(suggestionCountry);
        }

        // 4. Determine Street Address
        let streetAddr = "";
        if (addrObj.road) {
          streetAddr = addrObj.house_number
            ? `${addrObj.house_number} ${addrObj.road}`
            : addrObj.road;
        } else {
          streetAddr = suggestion.display_name?.split(",")[0] || "";
        }
        setAddress(streetAddr);

        // 5. Determine Landmark / Area
        const area =
          addrObj.suburb ||
          addrObj.neighbourhood ||
          addrObj.quarter ||
          addrObj.amenity ||
          "";
        setLandmark(area);
      } else {
        if (suggestion.display_name) {
          setAddress(suggestion.display_name);
        }
      }

      setLocationSuggestions([]);
      toast.success("Location and address fields updated.");
    },
    []
  );

  const handleGeocodeSearch = useCallback(async () => {
    if (!address) return;
    setIsSearchingLocation(true);
    setLocationSuggestions([]);

    const queryParts = [address, city, stateName, country].filter(Boolean);
    const searchQuery = encodeURIComponent(queryParts.join(", "));

    try {
      const response = await fetch(`/api/geocode?q=${searchQuery}`);
      if (response.ok) {
        const data = await response.json();
        setLocationSuggestions(data);
        if (data.length === 0) {
          toast.error(
            "No matching locations found. Please try a different address."
          );
        }
      } else {
        toast.error("Failed to search location.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to search location.");
    } finally {
      setIsSearchingLocation(false);
    }
  }, [address, city, stateName, country]);

  const requestNavigation = useCallback(
    (destination: string | "back"): Promise<boolean> => {
      if (!isDirty) return Promise.resolve(true);

      return new Promise((resolve) => {
        pendingNavigationRef.current = { destination, resolve };
        setShowBlockModal(true);
      });
    },
    [isDirty]
  );

  const confirmLeave = useCallback(
    (destination: string) => requestNavigation(destination),
    [requestNavigation]
  );

  useEffect(() => {
    onRegisterNavigationGuard?.({
      isDirty: () => isDirty,
      confirmLeave
    });
  }, [confirmLeave, isDirty, onRegisterNavigationGuard]);

  // Store initial values to compare against
  const initialDataRef = useRef({
    address: property?.address ?? "",
    landmark: property?.landmark ?? "",
    latitude: property?.latitude ?? undefined,
    longitude: property?.longitude ?? undefined,
    listingType: (property?.listingType as ListingType) ?? ListingType.SALE,
    // Store initial form field values from property
    title: property?.title ?? "",
    slug: property?.slug ?? "",
    description: property?.description ?? "",
    city: property?.city ?? "",
    lga: property?.lga ?? "",
    state: property?.state ?? "Lagos",
    country: property?.country ?? "Nigeria",
    status: String(property?.status ?? "AVAILABLE"),
    // Store initial conditional field values (using any for type flexibility)
    salePrice: property?.salePrice,
    bedrooms: property?.bedrooms,
    bathrooms: property?.bathrooms,
    toilets: property?.toilets,
    sizeSqm: property?.sizeSqm,
    rentalPrice: property?.rentalPrice,
    priceFrequency: property?.priceFrequency,
    availableFrom: property?.availableFrom,
    leaseTerm: property?.leaseTerm,
    serviceCharge: property?.serviceCharge,
    cautionFee: property?.cautionFee,
    landSizeSqm: property?.landSizeSqm,
    titleType: property?.titleType,
    negotiationStatus: property?.negotiationStatus,
    yearBuilt: property?.yearBuilt,
    furnished: property?.furnished,
    petsAllowed: property?.petsAllowed,
    estimatedCompletion: property?.estimatedCompletion,
    zoningType: property?.zoningType
  });

  // Check if form values have changed from initial
  /* const checkIfDirty = (formData?: FormData) => {
    const current = {
      address,
      landmark,
      latitude,
      longitude,
      listingType
    };

    const hasStateChanged =
      current.address !== initialDataRef.current.address ||
      current.landmark !== initialDataRef.current.landmark ||
      current.latitude !== initialDataRef.current.latitude ||
      current.longitude !== initialDataRef.current.longitude ||
      current.listingType !== initialDataRef.current.listingType;

    if (hasStateChanged) return true;

    // If formData is provided, check form fields
    if (formData) {
      const title = formData.get("title") as string;
      const slug = formData.get("slug") as string;
      const description = formData.get("description") as string;
      const city = formData.get("city") as string;
      const lga = formData.get("lga") as string;
      const state = formData.get("state") as string;
      const country = formData.get("country") as string;
      const status = formData.get("status") as string;

      if (title !== initialDataRef.current.title) return true;
      if (slug !== initialDataRef.current.slug) return true;
      if (description !== initialDataRef.current.description) return true;
      if (city !== initialDataRef.current.city) return true;
      if (lga !== initialDataRef.current.lga) return true;
      if (state !== initialDataRef.current.state) return true;
      if (country !== initialDataRef.current.country) return true;
      if (status !== initialDataRef.current.status) return true;

      // Check conditional fields
      const conditionalFields = [
        "salePrice",
        "bedrooms",
        "bathrooms",
        "toilets",
        "sizeSqm",
        "rentalPrice",
        "priceFrequency",
        "availableFrom",
        "leaseTerm",
        "serviceCharge",
        "cautionFee",
        "landSizeSqm",
        "titleType",
        "negotiationStatus",
        "yearBuilt",
        "furnished",
        "petsAllowed",
        "estimatedCompletion",
        "zoningType"
      ];

      for (const field of conditionalFields) {
        const currentValue = formData.get(field);
        const initialValue =
          initialDataRef.current[field as keyof typeof initialDataRef.current];

        // Handle null/undefined/empty string comparisons
        if (currentValue === "" || currentValue === null) {
          if (
            initialValue !== null &&
            initialValue !== undefined &&
            initialValue !== ""
          ) {
            return true;
          }
        } else if (String(currentValue) !== String(initialValue ?? "")) {
          return true;
        }
      }
    }

    return false;
  }; */

  // 1. Browser navigation (close tab, refresh, external links)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

  // 2. In-app navigation & Popstate (back button)
  useEffect(() => {
    if (!isDirty) return;

    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");

      if (anchor) {
        const href = anchor.getAttribute("href");
        const targetAttr = anchor.getAttribute("target");
        if (
          href &&
          targetAttr !== "_blank" &&
          (href.startsWith("/") || href.startsWith(window.location.origin))
        ) {
          e.preventDefault();
          pendingNavigationRef.current = { destination: href };
          setShowBlockModal(true);
        }
      }
    };

    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
      pendingNavigationRef.current = { destination: "back" };
      setShowBlockModal(true);
    };

    window.history.pushState(null, "", window.location.href);

    document.addEventListener("click", handleAnchorClick, true);
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("click", handleAnchorClick, true);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isDirty]);

  useEffect(() => {
    return () => {
      staged.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    };
  }, [staged]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    // Manual Validation for required fields
    const titleVal = (formData.get("title") as string)?.trim();
    if (!titleVal) {
      toast.error("Property Title is required.");
      return;
    }
    const slugVal = (formData.get("slug") as string)?.trim();
    if (!slugVal) {
      toast.error("Slug / URL Identifier is required.");
      return;
    }
    const descriptionVal = (formData.get("description") as string)?.trim();
    if (!descriptionVal) {
      toast.error("Description is required.");
      return;
    }
    const cityVal = (formData.get("city") as string)?.trim();
    if (!cityVal) {
      toast.error("City is required.");
      return;
    }
    const stateVal = (formData.get("state") as string)?.trim();
    if (!stateVal) {
      toast.error("State is required.");
      return;
    }
    const countryVal = (formData.get("country") as string)?.trim();
    if (!countryVal) {
      toast.error("Country is required.");
      return;
    }

    const payload = Object.fromEntries(formData.entries()) as Record<
      string,
      unknown
    >;

    // Add location data to payload
    if (latitude !== undefined) payload.latitude = latitude;
    if (longitude !== undefined) payload.longitude = longitude;
    payload.address = address;
    payload.landmark = landmark;
    payload.lga = lga;

    // Define all conditional fields we want to track
    const allConditionalFields = [
      "salePrice",
      "bedrooms",
      "bathrooms",
      "toilets",
      "sizeSqm",
      "rentalPrice",
      "priceFrequency",
      "availableFrom",
      "leaseTerm",
      "serviceCharge",
      "cautionFee",
      "landSizeSqm",
      "titleType",
      "estimatedCompletion",
      "zoningType",
      "furnished",
      "petsAllowed",
      "negotiationStatus",
      "yearBuilt"
    ];

    // Find the fields that belong to the active listing type
    const activeFields = CONDITIONAL_PROPERTY_FIELDS[listingType].map(
      (f) => f.name
    );

    // Clean and validate form inputs based on conditional fields
    for (const field of allConditionalFields) {
      if (!activeFields.includes(field)) {
        if (field === "negotiationStatus") {
          delete payload[field];
        } else {
          payload[field] = null;
        }
      } else {
        if (payload[field] === "" || payload[field] === undefined) {
          if (field === "negotiationStatus") {
            delete payload[field];
          } else {
            payload[field] = null;
          }
        } else {
          // Coerce number fields to numeric values on client side
          const fieldDef = CONDITIONAL_PROPERTY_FIELDS[listingType].find(
            (f) => f.name === field
          );
          if (fieldDef?.type === "number") {
            payload[field] = Number(payload[field]);
          } else if (field === "furnished" || field === "petsAllowed") {
            if (payload[field] === "true") payload[field] = true;
            else if (payload[field] === "false") payload[field] = false;
            else payload[field] = null;
          }
        }
      }
    }

    // Set toilets value to mirror bathrooms value for backend logic
    if (payload.bathrooms !== undefined && payload.bathrooms !== null && payload.bathrooms !== "") {
      payload.toilets = Number(payload.bathrooms);
    } else {
      payload.toilets = null;
    }

    const response = await fetch(
      isEditing ? `/api/properties/${currentProperty?.id}` : "/api/properties",
      {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }
    );

    const data = (await response.json().catch(() => null)) as {
      property?: Property;
      error?: unknown;
    } | null;

    if (response.ok) {
      // Update initial data ref to reflect the new saved values
      // Update initial data ref to reflect the new saved values
      initialDataRef.current = {
        address,
        landmark,
        latitude,
        longitude,
        listingType,
        title: payload.title as string,
        slug: payload.slug as string,
        description: payload.description as string,
        city: payload.city as string,
        lga: payload.lga as string,
        state: payload.state as string,
        country: payload.country as string,
        status: payload.status as string,
        salePrice: payload.salePrice as number | null | undefined,
        bedrooms: payload.bedrooms as number | null | undefined,
        bathrooms: payload.bathrooms as number | null | undefined,
        toilets: payload.toilets as number | null | undefined,
        sizeSqm: payload.sizeSqm as number | null | undefined,
        rentalPrice: payload.rentalPrice as number | null | undefined,
        priceFrequency: payload.priceFrequency as
          | PriceFrequency
          | null
          | undefined,
        availableFrom: payload.availableFrom as
          | Date
          | string
          | null
          | undefined,
        leaseTerm: payload.leaseTerm as string | null | undefined,
        serviceCharge: payload.serviceCharge as number | null | undefined,
        cautionFee: payload.cautionFee as number | null | undefined,
        landSizeSqm: payload.landSizeSqm as number | null | undefined,
        titleType: payload.titleType as string | null | undefined,
        negotiationStatus: payload.negotiationStatus as
          | NegotiationStatus
          | undefined,
        yearBuilt: payload.yearBuilt as number | null | undefined,
        furnished: payload.furnished as boolean | null | undefined,
        petsAllowed: payload.petsAllowed as boolean | null | undefined,
        estimatedCompletion: payload.estimatedCompletion as
          | Date
          | string
          | null
          | undefined,
        zoningType: payload.zoningType as string | null | undefined
      };
      setIsDirty(false);
      setFormStatus(
        isEditing
          ? "Property saved."
          : "Property saved. Opening media editor..."
      );

      toast.success(
        isEditing
          ? "Property saved successfully."
          : "Property created successfully! You can now upload media."
      );

      if (data?.property) {
        setCurrentProperty(data.property as unknown as Property);
        if (data.property.media) {
          setMedia(data.property.media);
        }
      }

      if (!isEditing && data?.property?.id) {
        router.push(`/admin/dashboard/properties/${data.property.id}/edit`);
        router.refresh();
        return;
      }
      router.refresh();
      return;
    }

    let errorMsg = "Failed to save property.";
    if (data?.error) {
      if (typeof data.error === "string") {
        errorMsg = data.error;
      } else if (typeof data.error === "object") {
        const zodError = data.error as {
          fieldErrors?: Record<string, string[]>;
          formErrors?: string[];
        };
        if (zodError.fieldErrors) {
          const messages = Object.entries(zodError.fieldErrors)
            .map(([field, errors]) => `${field}: ${errors.join(", ")}`)
            .join(" | ");
          errorMsg = messages || "Validation failed.";
        } else if (zodError.formErrors && zodError.formErrors.length > 0) {
          errorMsg = zodError.formErrors.join(", ");
        }
      }
    }
    setFormStatus(errorMsg);
    toast.error(errorMsg);
  }

  function stageFiles(files: FileList | File[], mediaType: MediaType) {
    if (mediaType === MediaType.TOUR && hasTourVideo) {
      setMediaStatus(
        "Remove the existing tour video before adding another one."
      );
      return;
    }

    const allowedPrefix = mediaType === MediaType.IMAGE ? "image/" : "video/";
    const selectedFiles = Array.from(files).filter((file) =>
      file.type.startsWith(allowedPrefix)
    );
    const nextFiles =
      mediaType === MediaType.TOUR ? selectedFiles.slice(0, 1) : selectedFiles;

    if (!nextFiles.length) {
      setMediaStatus(
        mediaType === MediaType.IMAGE
          ? "Choose at least one image file."
          : "Choose a video file."
      );
      return;
    }

    const nextItems = nextFiles.map((file) => ({
      id: createId(),
      file,
      previewUrl: URL.createObjectURL(file),
      altText: getDefaultAltText(file),
      mediaType
    }));

    setStaged((current) => [...current, ...nextItems]);
    setMediaStatus(
      `${nextItems.length} ${mediaType === MediaType.IMAGE ? "image" : "video"}${nextItems.length === 1 ? "" : "s"} ready to upload.`
    );
  }

  function onFileChange(
    event: ChangeEvent<HTMLInputElement>,
    mediaType: MediaType
  ) {
    if (event.target.files) stageFiles(event.target.files, mediaType);
    event.target.value = "";
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    stageFiles(event.dataTransfer.files, MediaType.IMAGE);
  }

  function removeStaged(id: string) {
    setStaged((current) => {
      const item = current.find((entry) => entry.id === id);
      if (item) URL.revokeObjectURL(item.previewUrl);
      return current.filter((entry) => entry.id !== id);
    });
  }

  function clearStaged() {
    staged.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    setStaged([]);
    setMediaStatus("Selection cleared.");
  }

  function updateAltText(id: string, value: string) {
    setStaged((current) =>
      current.map((item) =>
        item.id === id ? { ...item, altText: value } : item
      )
    );
  }

  async function uploadStaged(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!currentProperty || !staged.length || isUploading) return;

    setIsUploading(true);
    const toastId = toast.loading(
      `Uploading ${staged.length} file${staged.length === 1 ? "" : "s"}...`
    );
    setMediaStatus(
      `Uploading ${staged.length} file${staged.length === 1 ? "" : "s"}...`
    );
    const completed: PropertyMedia[] = [];

    for (const [index, item] of staged.entries()) {
      const formData = new FormData();
      formData.append("file", item.file);
      formData.append("propertyId", currentProperty.id);
      formData.append("altText", item.altText);
      formData.append("mediaType", item.mediaType);
      formData.append("order", String(media.length + completed.length));

      const response = await fetch("/api/media/upload", {
        method: "POST",
        body: formData
      });

      const data = (await response
        .json()
        .catch(() => null)) as UploadResponse | null;

      if (!response.ok || !data) {
        const errorMsg = `Upload failed on ${item.file.name}: ${data?.error ?? "The server could not process this file."}`;
        setMediaStatus(errorMsg);
        toast.error(errorMsg, { id: toastId });
        setIsUploading(false);
        setStaged((current) => current.slice(index));
        if (completed.length) setMedia((current) => [...current, ...completed]);
        router.refresh();
        return;
      }

      completed.push(data);
      URL.revokeObjectURL(item.previewUrl);
    }

    setMedia((current) => [...current, ...completed]);
    setStaged([]);
    setIsUploading(false);
    setMediaStatus("Media uploaded and attached to this property.");
    toast.success("Media uploaded successfully!", { id: toastId });
    router.refresh();
  }

  async function performDeleteMedia(item: PropertyMedia) {
    setDeletingId(item.id);
    setMediaStatus("Deleting media...");

    try {
      const response = await fetch(`/api/media/${item.id}`, {
        method: "DELETE"
      });

      if (response.ok) {
        setMedia((current) => current.filter((entry) => entry.id !== item.id));
        setMediaStatus("Media deleted.");
        setDeletingId(null);
        toast.success("Media deleted successfully.");
        router.refresh();
        return;
      }

      const data = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;
      setMediaStatus(data?.error ?? "Failed to delete media.");
      toast.error(data?.error ?? "Failed to delete media.");
      setDeletingId(null);
    } catch {
      setMediaStatus("Failed to delete media.");
      toast.error("Failed to delete media.");
      setDeletingId(null);
    }
  }

  function deleteMedia(item: PropertyMedia) {
    if (deletingId) return;

    toast.warning("Confirm Deletion", {
      description: `Remove this ${getMediaLabel(item.mediaType).toLowerCase()}?`,
      action: {
        label: "Remove",
        onClick: () => void performDeleteMedia(item)
      },
      cancel: {
        label: "Cancel",
        onClick: () => {}
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* 1. Property Form */}
      <form
        onSubmit={onSubmit}
        onChange={() => setIsDirty(true)}
        noValidate
        className="space-y-4 rounded-lg border border-border bg-bg-secondary p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Title */}
          <div className="space-y-1">
            <label
              htmlFor="title"
              className="block text-sm font-semibold text-text-primary">
              Property Title <span className="text-rose-500 font-bold ml-0.5" title="Required">*</span>
            </label>
            <input
              id="title"
              name="title"
              value={title}
              onChange={(e) => {
                const newTitle = e.target.value;
                setTitle(newTitle);
                setSlug(slugify(newTitle));
                setIsDirty(true);
              }}
              placeholder="e.g. Luxury 4-Bedroom Duplex"
              required
              className="w-full rounded-md border border-border bg-bg-primary px-3 py-2.5 text-sm text-text-primary focus:border-accent focus:outline-none"
            />
          </div>

          {/* Slug */}
          <div className="space-y-1">
            <label
              htmlFor="slug"
              className="block text-sm font-semibold text-text-primary">
              Slug / URL Identifier <span className="text-rose-500 font-bold ml-0.5" title="Required">*</span>
            </label>
            <input
              id="slug"
              name="slug"
              value={slug}
              readOnly
              placeholder="Auto-generated from title"
              required
              className="w-full rounded-md border border-border bg-bg-secondary px-3 py-2.5 text-sm text-text-muted cursor-not-allowed opacity-75 focus:outline-none"
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label
            htmlFor="description"
            className="block text-sm font-semibold text-text-primary">
            Description <span className="text-rose-500 font-bold ml-0.5" title="Required">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            defaultValue={property?.description}
            placeholder="Detailed description of the property features, amenities, and surroundings..."
            required
            className="min-h-32 w-full rounded-md border border-border bg-bg-primary px-3 py-2.5 text-sm text-text-primary focus:border-accent focus:outline-none leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Listing Type */}
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-text-primary">
              Listing Type <span className="text-rose-500 font-bold ml-0.5" title="Required">*</span>
            </label>
            <AppSelect
              name="listingType"
              value={listingType}
              onValueChange={(value) => {
                setListingType(value as ListingType);
              }}
              placeholder="Listing Type"
              options={Object.values(ListingType).map((value) => ({
                value,
                label: formatEnum(value)
              }))}
            />
          </div>

          {/* Status */}
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-text-primary">
              Property Status <span className="text-rose-500 font-bold ml-0.5" title="Required">*</span>
            </label>
            <AppSelect
              name="status"
              defaultValue={String(
                property?.status ?? PropertyStatus.AVAILABLE
              )}
              placeholder="Property Status"
              options={Object.values(PropertyStatus).map((value) => ({
                value,
                label: formatEnum(value)
              }))}
            />
          </div>
        </div>

        {/* Dynamic Fields */}
        {CONDITIONAL_PROPERTY_FIELDS[listingType] &&
          CONDITIONAL_PROPERTY_FIELDS[listingType].length > 0 && (
            <div
              key={listingType}
              className="grid grid-cols-1 gap-4 md:grid-cols-2 border-t border-border/30 pt-4 mt-2">
              <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider col-span-full mb-1">
                {formatEnum(listingType)} Specifications
              </h3>
              {CONDITIONAL_PROPERTY_FIELDS[listingType].map((field) => {
                if (field.type === "select") {
                  return (
                    <div key={field.name} className="space-y-1">
                      <label className="block text-sm font-semibold text-text-primary">
                        {field.label} <span className="text-[11px] font-normal text-text-muted/70 ml-1.5">(optional)</span>
                      </label>
                      <AppSelect
                        name={field.name}
                        defaultValue={
                          property?.[field.name as keyof Property] !== null &&
                          property?.[field.name as keyof Property] !== undefined
                            ? String(property[field.name as keyof Property])
                            : ""
                        }
                        placeholder={field.placeholder || field.label}
                        options={field.options || []}
                      />
                    </div>
                  );
                }

                if (field.type === "date") {
                  return (
                    <div key={field.name} className="space-y-1">
                      <label
                        htmlFor={field.name}
                        className="block text-sm font-semibold text-text-primary">
                        {field.label} <span className="text-[11px] font-normal text-text-muted/70 ml-1.5">(optional)</span>
                      </label>
                      <input
                        id={field.name}
                        name={field.name}
                        type="date"
                        defaultValue={(() => {
                          const value =
                            property?.[field.name as keyof Property];
                          if (
                            value &&
                            (typeof value === "string" || value instanceof Date)
                          ) {
                            return formatDateForInput(value);
                          }
                          return "";
                        })()}
                        className="w-full rounded-md border border-border bg-bg-primary px-3 py-2.5 text-sm text-text-primary focus:border-accent focus:outline-none"
                      />
                    </div>
                  );
                }

                return (
                  <div key={field.name} className="space-y-1">
                    <label
                      htmlFor={field.name}
                      className="block text-sm font-semibold text-text-primary">
                      {field.label} <span className="text-[11px] font-normal text-text-muted/70 ml-1.5">(optional)</span>
                    </label>
                    <input
                      id={field.name}
                      name={field.name}
                      type={field.type}
                      defaultValue={
                        property?.[field.name as keyof Property] !== null &&
                        property?.[field.name as keyof Property] !== undefined
                          ? String(property[field.name as keyof Property])
                          : ""
                      }
                      placeholder={field.placeholder}
                      className="w-full rounded-md border border-border bg-bg-primary px-3 py-2.5 text-sm text-text-primary focus:border-accent focus:outline-none"
                    />
                  </div>
                );
              })}
            </div>
          )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {/* LGA */}
          <div className="space-y-1">
            <label
              htmlFor="lga"
              className="block text-sm font-semibold text-text-primary">
              LGA (Local Govt Area) <span className="text-[11px] font-normal text-text-muted/70 ml-1.5">(optional)</span>
            </label>
            <input
              id="lga"
              name="lga"
              value={lga}
              onChange={(e) => {
                setLga(e.target.value);
                setIsDirty(true);
              }}
              placeholder="e.g. Ajeromi/Ifelodun"
              className="w-full rounded-md border border-border bg-bg-primary px-3 py-2.5 text-sm text-text-primary focus:border-accent focus:outline-none"
            />
          </div>

          {/* City */}
          <div className="space-y-1">
            <label
              htmlFor="city"
              className="block text-sm font-semibold text-text-primary">
              City <span className="text-rose-500 font-bold ml-0.5" title="Required">*</span>
            </label>
            <input
              id="city"
              name="city"
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setIsDirty(true);
              }}
              placeholder="e.g. Lekki"
              required
              className="w-full rounded-md border border-border bg-bg-primary px-3 py-2.5 text-sm text-text-primary focus:border-accent focus:outline-none"
            />
          </div>

          {/* State */}
          <div className="space-y-1">
            <label
              htmlFor="state"
              className="block text-sm font-semibold text-text-primary">
              State <span className="text-rose-500 font-bold ml-0.5" title="Required">*</span>
            </label>
            <input
              id="state"
              name="state"
              value={stateName}
              onChange={(e) => {
                setStateName(e.target.value);
                setIsDirty(true);
              }}
              placeholder="e.g. Lagos"
              required
              className="w-full rounded-md border border-border bg-bg-primary px-3 py-2.5 text-sm text-text-primary focus:border-accent focus:outline-none"
            />
          </div>

          {/* Country */}
          <div className="space-y-1">
            <label
              htmlFor="country"
              className="block text-sm font-semibold text-text-primary">
              Country <span className="text-rose-500 font-bold ml-0.5" title="Required">*</span>
            </label>
            <input
              id="country"
              name="country"
              value={country}
              onChange={(e) => {
                setCountry(e.target.value);
                setIsDirty(true);
              }}
              placeholder="e.g. Nigeria"
              required
              className="w-full rounded-md border border-border bg-bg-primary px-3 py-2.5 text-sm text-text-primary focus:border-accent focus:outline-none"
            />
          </div>
        </div>

        {/* Location Sub-Card */}
        <div className="space-y-4 rounded-lg border border-border/50 bg-bg-primary p-4 mt-2">
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider border-b border-border/50 pb-2">
            Detailed Location & Coordinates
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="relative">
              <label
                htmlFor="address"
                className="block text-sm font-semibold text-text-primary mb-1">
                Street Address <span className="text-[11px] font-normal text-text-muted/70 ml-1.5">(optional)</span>
              </label>
              <div className="flex gap-2">
                <input
                  id="address"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    setIsDirty(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleGeocodeSearch();
                    }
                  }}
                  placeholder="e.g., 123 Main Street, Victoria Island"
                  className="flex-1 rounded-md border border-border bg-bg-secondary px-3 py-2.5 text-sm text-text-primary focus:border-accent focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleGeocodeSearch}
                  disabled={isSearchingLocation || !address}
                  className="rounded-md bg-accent px-4 py-2.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer">
                  {isSearchingLocation ? "Searching..." : "Locate"}
                </button>
              </div>

              {/* Suggestions dropdown */}
              {locationSuggestions.length > 0 && (
                <div
                  ref={suggestionsRef}
                  className="absolute z-999 mt-1 w-full max-h-60 overflow-y-auto rounded-lg border border-border bg-bg-secondary shadow-xl p-2 space-y-1 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-200">
                  <p className="text-[10px] font-bold text-text-muted px-2.5 py-1.5 uppercase tracking-wider border-b border-border/50 mb-1">
                    Matching Locations
                  </p>
                  {locationSuggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => applySuggestedLocation(suggestion)}
                      className="w-full flex items-start gap-2.5 text-left px-2.5 py-2 text-xs hover:bg-bg-tertiary rounded-md text-text-primary transition cursor-pointer group"
                      title={suggestion.display_name}>
                      <MapPin
                        size={16}
                        className="text-text-muted group-hover:text-accent mt-0.5 shrink-0 transition"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-xs text-text-primary truncate">
                          {suggestion.display_name?.split(",")[0] ||
                            "Unknown Road"}
                        </p>
                        <p className="text-[10px] text-text-muted truncate mt-0.5">
                          {suggestion.display_name
                            ?.split(",")
                            .slice(1)
                            .join(",")
                            .trim()}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="landmark"
                className="block text-sm font-semibold text-text-primary mb-1">
                Landmark / Area <span className="text-[11px] font-normal text-text-muted/70 ml-1.5">(optional)</span>
              </label>
              <input
                id="landmark"
                value={landmark}
                onChange={(e) => {
                  setLandmark(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="e.g., Near Lekki Phase 1 Gate"
                className="w-full rounded-md border border-border bg-bg-secondary px-3 py-2.5 text-sm text-text-primary focus:border-accent focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">
              Select Location on Map <span className="text-[11px] font-normal text-text-muted/70 ml-1.5">(optional)</span>
            </label>
            <div className="rounded-lg border border-border overflow-hidden bg-bg-secondary">
              <MapPicker
                initialLat={latitude}
                initialLng={longitude}
                onLocationChange={handleLocationChange}
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-3 border-t border-border flex items-center gap-4 flex-wrap">
          <button
            type="submit"
            className="rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition cursor-pointer">
            Save Property
          </button>
          {formStatus ? (
            <p
              className={`text-xs font-semibold ${formStatus.includes("saved") ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>
              {formStatus}
            </p>
          ) : null}
        </div>
      </form>

      {/* 2. Media Section */}
      {currentProperty ? (
        <form
          onSubmit={uploadStaged}
          className="overflow-hidden rounded-lg border border-border bg-bg-secondary shadow-sm">
          {/* File Inputs (Hidden) */}
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(event) => onFileChange(event, MediaType.IMAGE)}
            className="sr-only"
          />
          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            multiple
            onChange={(event) => onFileChange(event, MediaType.VIDEO)}
            className="sr-only"
          />
          <input
            ref={tourInputRef}
            type="file"
            accept="video/*"
            onChange={(event) => onFileChange(event, MediaType.TOUR)}
            className="sr-only"
          />

          {/* Media Header */}
          <div className="border-b border-border p-4 bg-bg-secondary">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-text-primary">
                  Property Media Manager
                </h2>
                <p className="text-xs text-text-muted">
                  Attach HD images, walk-through videos, or virtual tours to
                  this property listing.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {staged.length ? (
                  <button
                    type="button"
                    onClick={clearStaged}
                    disabled={isUploading}
                    className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs font-semibold text-text-secondary transition hover:border-red-400 hover:text-red-500 bg-bg-primary disabled:opacity-60">
                    <X size={14} />
                    Cancel
                  </button>
                ) : null}
                <button
                  type="submit"
                  disabled={!staged.length || isUploading}
                  className="inline-flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm">
                  {isUploading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <UploadCloud size={14} />
                  )}
                  {isUploading ? "Uploading..." : "Upload Selection"}
                </button>
              </div>
            </div>
          </div>

          {/* Media Interactive Area */}
          <div className="grid gap-5 p-4 lg:grid-cols-2">
            {/* Left: Upload and Controls */}
            <div className="space-y-4">
              {/* Drag Zone */}
              <div
                onDragOver={(event) => {
                  event.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
                onClick={() => imageInputRef.current?.click()}
                className={`relative flex min-h-52 cursor-pointer flex-col justify-end overflow-hidden rounded-lg border border-dashed transition ${
                  isDragging
                    ? "border-accent bg-accent/10"
                    : "border-border bg-bg-primary hover:border-accent/40"
                }`}>
                <div
                  className="absolute inset-0 bg-[linear-gradient(135deg,rgba(57,75,209,0.06),rgba(8,12,32,0.92))]"
                  aria-hidden="true"
                />
                <div className="relative p-4 text-white">
                  <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-white backdrop-blur">
                    <ImagePlus size={20} />
                  </div>
                  <h3 className="text-lg font-semibold">
                    Drag & Drop Property Images
                  </h3>
                  <p className="mt-0.5 text-xs text-white/70">
                    Or click here to browse files. Use controls below to upload
                    video/tours.
                  </p>
                </div>
              </div>

              {/* Upload Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="inline-flex items-center justify-center gap-1.5 rounded-md border border-border px-3 py-2.5 text-xs font-semibold text-text-secondary bg-bg-primary transition hover:border-accent hover:text-text-primary">
                  <ImagePlus size={14} />
                  Add Images
                </button>
                <button
                  type="button"
                  onClick={() => videoInputRef.current?.click()}
                  className="inline-flex items-center justify-center gap-1.5 rounded-md border border-border px-3 py-2.5 text-xs font-semibold text-text-secondary bg-bg-primary transition hover:border-accent hover:text-text-primary">
                  <Video size={14} />
                  Add Videos
                </button>
                <button
                  type="button"
                  onClick={() => tourInputRef.current?.click()}
                  disabled={hasTourVideo}
                  className="inline-flex items-center justify-center gap-1.5 rounded-md border border-border px-3 py-2.5 text-xs font-semibold text-text-secondary bg-bg-primary transition hover:border-accent hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50">
                  <Video size={14} />
                  Add Tour Video
                </button>
              </div>

              {/* Uploaded Gallery */}
              <div className="pt-2 border-t border-border/80">
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-text-muted">
                  Attached Gallery ({media.length})
                </p>
                {media.length ? (
                  <div className="grid gap-3 sm:grid-cols-2 max-h-96 overflow-y-auto pr-1">
                    {media.map((item, index) => (
                      <div
                        key={item.id}
                        className="overflow-hidden rounded-lg border border-border bg-bg-primary flex flex-col justify-between shadow-xs">
                        <div className="relative aspect-video bg-bg-secondary">
                          {item.mediaType === MediaType.IMAGE ? (
                            <Image
                              src={item.thumbnailUrl || item.url}
                              alt={item.altText || currentProperty.title}
                              fill
                              sizes="(max-width: 640px) 100vw, 30vw"
                              className="object-cover"
                            />
                          ) : (
                            <video
                              src={item.url}
                              controls
                              className="h-full w-full bg-black object-contain"
                            />
                          )}
                          <span className="absolute left-1.5 top-1.5 rounded bg-bg-primary/90 px-1.5 py-0.5 text-[10px] font-bold text-text-primary border border-border">
                            {index + 1}. {getMediaLabel(item.mediaType)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-2 p-2 bg-bg-secondary/30">
                          <p className="min-w-0 truncate text-xs text-text-secondary">
                            {item.altText || item.publicId}
                          </p>
                          <button
                            type="button"
                            onClick={() => void deleteMedia(item)}
                            disabled={deletingId === item.id}
                            title="Remove media"
                            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border text-text-secondary transition hover:border-red-400 hover:text-red-500 bg-bg-primary disabled:opacity-60">
                            {deletingId === item.id ? (
                              <Loader2 size={13} className="animate-spin" />
                            ) : (
                              <Trash2 size={13} />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex min-h-24 items-center justify-center rounded-lg border border-border bg-bg-primary p-4 text-center">
                    <p className="text-xs text-text-muted">
                      No media files uploaded yet.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Selected Selection Queue */}
            <div className="space-y-4 border-t lg:border-t-0 lg:border-l border-border/80 lg:pl-5 pt-4 lg:pt-0">
              <p className="text-xs font-bold uppercase tracking-wider text-text-muted">
                Selected Previews Queue ({staged.length})
              </p>
              {staged.length ? (
                <div className="max-h-120 space-y-3 overflow-y-auto pr-1">
                  {staged.map((item, index) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-[80px_1fr_auto] gap-3 rounded-lg border border-border bg-bg-primary p-2 items-center">
                      {item.mediaType === MediaType.IMAGE ? (
                        <div
                          className="h-16 rounded bg-cover bg-center border border-border"
                          style={{ backgroundImage: `url(${item.previewUrl})` }}
                          aria-label={item.file.name}
                        />
                      ) : (
                        <video
                          src={item.previewUrl}
                          className="h-16 rounded bg-black object-cover border border-border"
                          muted
                        />
                      )}
                      <div className="min-w-0 space-y-1.5">
                        <div>
                          <p className="truncate text-xs font-semibold text-text-primary">
                            {index + 1}. {item.file.name}
                          </p>
                          <p className="text-[10px] text-text-muted">
                            {getMediaLabel(item.mediaType)} /{" "}
                            {formatFileSize(item.file.size)}
                          </p>
                        </div>
                        <input
                          value={item.altText}
                          onChange={(event) =>
                            updateAltText(item.id, event.target.value)
                          }
                          placeholder="Alt description text (highly recommended)"
                          className="w-full rounded border border-border bg-bg-secondary px-2 py-1 text-xs text-text-primary focus:outline-none focus:border-accent"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeStaged(item.id)}
                        disabled={isUploading}
                        title="Remove selection"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-text-secondary bg-bg-primary transition hover:border-red-400 hover:text-red-500 disabled:opacity-60">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex min-h-48 items-center justify-center rounded-lg border border-border bg-bg-primary p-6 text-center">
                  <p className="text-xs text-text-muted">
                    Your upload queue is currently empty.
                  </p>
                </div>
              )}
              {mediaStatus ? (
                <p className="text-xs font-semibold text-text-secondary bg-bg-primary/50 border border-border p-2 rounded text-center">
                  {mediaStatus}
                </p>
              ) : null}
            </div>
          </div>
        </form>
      ) : (
        <section className="rounded-lg border border-border bg-bg-secondary p-5 shadow-sm text-center">
          <h2 className="text-base font-semibold text-text-primary">
            Property Media Manager
          </h2>
          <p className="mt-1 text-xs text-text-muted">
            You must fill and save the property details above before you can
            upload media.
          </p>
        </section>
      )}

      {showBlockModal && (
        <div className="fixed inset-0 z-10000 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-md bg-bg-secondary border border-border rounded-lg p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200 text-left">
            <h3 className="text-lg font-bold text-text-primary font-display">
              Leave without saving?
            </h3>
            <p className="text-sm text-text-secondary">
              You have unsaved changes. If you leave now, your changes will be
              lost.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  pendingNavigationRef.current?.resolve?.(false);
                  pendingNavigationRef.current = null;
                  setShowBlockModal(false);
                }}
                className="px-4 py-2 text-xs font-semibold text-text-secondary border border-border rounded-md hover:bg-bg-primary transition cursor-pointer">
                Stay on page
              </button>
              <button
                onClick={() => {
                  const pending = pendingNavigationRef.current;
                  pendingNavigationRef.current = null;
                  setIsDirty(false);
                  setShowBlockModal(false);

                  // Go back 1 step to pop the extra history state pushed for popstate interception
                  window.history.back();

                  // Allow a tiny delay for the history state to settle before navigating
                  setTimeout(() => {
                    if (pending?.resolve) {
                      pending.resolve(true);
                      return;
                    }

                    if (pending?.destination === "back") {
                      router.back();
                    } else if (pending?.destination) {
                      router.push(pending.destination);
                    }
                  }, 50);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-accent rounded-md hover:opacity-90 transition cursor-pointer">
                Leave anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
