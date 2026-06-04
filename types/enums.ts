export enum ListingType {
  SALE = "SALE",
  RENTAL = "RENTAL",
  LAND = "LAND",
  DEVELOPMENT = "DEVELOPMENT",
}

export enum PropertyStatus {
  AVAILABLE = "AVAILABLE",
  SOLD = "SOLD",
  LET = "LET",
  UNDER_OFFER = "UNDER_OFFER",
  COMING_SOON = "COMING_SOON",
}

export enum InquiryStatus {
  NEW = "NEW",
  CONTACTED = "CONTACTED",
  FOLLOW_UP = "FOLLOW_UP",
  CLOSED = "CLOSED",
  SPAM = "SPAM",
}

export enum InquirySource {
  PROPERTY_PAGE = "PROPERTY_PAGE",
  CONTACT_FORM = "CONTACT_FORM",
  WHATSAPP_FLOAT = "WHATSAPP_FLOAT",
  FEATURED_CARD = "FEATURED_CARD",
}

export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  VIEWER = "VIEWER",
}

export enum MediaType {
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  TOUR = "TOUR",
}

export enum PriceFrequency {
  ONE_OFF = "ONE_OFF",
  PER_MONTH = "PER_MONTH",
  PER_YEAR = "PER_YEAR",
}

export enum NegotiationStatus {
  FIXED = "FIXED",
  NEGOTIABLE = "NEGOTIABLE",
  CONTACT_FOR_PRICE = "CONTACT_FOR_PRICE",
}
