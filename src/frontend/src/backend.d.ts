import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface CreateBookingRequest {
    destination: string;
    package: PackageDetails;
    sender: Person;
    shippingOption: ShippingOption;
    receiver: Person;
}
export type Time = bigint;
export interface UpdateStatusRequest {
    status: ParcelStatus;
    note: string;
    location: string;
}
export type TrackingNumber = string;
export type Pincode = string;
export interface BookingConfirmation {
    status: ParcelStatus;
    trackingNumber: TrackingNumber;
    bookingId: bigint;
    createdAt: Time;
    estimatedDelivery: string;
}
export interface PackageDetails {
    weight: number;
    description: string;
    dimensions: string;
}
export type PhoneNumber = string;
export interface TrackingUpdate {
    status: ParcelStatus;
    note: string;
    timestamp: Time;
    location: string;
}
export interface Booking {
    trackingNumber: TrackingNumber;
    destination: string;
    bookingId: bigint;
    package: PackageDetails;
    createdAt: Time;
    sender: Person;
    shippingOption: ShippingOption;
    trackingUpdates: Array<TrackingUpdate>;
    receiver: Person;
    currentStatus: ParcelStatus;
}
export interface Person {
    name: string;
    address: string;
    phone: PhoneNumber;
    pincode: Pincode;
}
export interface UserProfile {
    name: string;
    email: string;
    phone: PhoneNumber;
}
export enum ParcelStatus {
    outForDelivery = "outForDelivery",
    inTransit = "inTransit",
    delivered = "delivered",
    queued = "queued"
}
export enum ShippingOption {
    express = "express",
    overnight = "overnight",
    standard = "standard"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    assignUserRole(user: Principal, role: UserRole): Promise<void>;
    createBooking(request: CreateBookingRequest): Promise<BookingConfirmation>;
    getActiveTrackingNumbers(): Promise<Array<TrackingNumber>>;
    getAllBookings(): Promise<Array<Booking>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getStatusHistory(trackingNumber: TrackingNumber): Promise<Array<TrackingUpdate>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserRole(): Promise<UserRole>;
    initializeAccessControl(): Promise<void>;
    isAdmin(): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    isDelivered(trackingNumber: TrackingNumber): Promise<boolean>;
    isTrackingNumberValid(trackingNumber: TrackingNumber): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    trackParcel(trackingNumber: TrackingNumber): Promise<Booking>;
    updateParcelStatus(trackingNumber: TrackingNumber, update: UpdateStatusRequest): Promise<void>;
}
