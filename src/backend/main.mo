import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";


import AccessControl "authorization/access-control";


actor {
  type TrackingNumber = Text;
  type PhoneNumber = Text;
  type Pincode = Text;

  let accessControlState = AccessControl.initState();
  var nextBookingId = 0;

  type ParcelStatus = {
    #queued;
    #inTransit;
    #outForDelivery;
    #delivered;
  };

  module ParcelStatus {
    public func compare(status1 : ParcelStatus, status2 : ParcelStatus) : Order.Order {
      switch (status1, status2) {
        case (#queued, #queued) { #equal };
        case (#queued, _) { #less };
        case (#inTransit, #queued) { #greater };
        case (#inTransit, #inTransit) { #equal };
        case (#inTransit, _) { #less };
        case (#outForDelivery, #delivered) { #less };
        case (#outForDelivery, #outForDelivery) { #equal };
        case (#outForDelivery, _) { #greater };
        case (#delivered, #delivered) { #equal };
        case (#delivered, _) { #greater };
      };
    };
  };

  type Person = {
    name : Text;
    address : Text;
    phone : PhoneNumber;
    pincode : Pincode;
  };

  module Person {
    public func compare(person1 : Person, person2 : Person) : Order.Order {
      Text.compare(person1.name, person2.name);
    };
  };

  type PackageDetails = {
    weight : Float;
    dimensions : Text;
    description : Text;
  };

  module PackageDetails {
    public func compare(package1 : PackageDetails, package2 : PackageDetails) : Order.Order {
      Text.compare(package1.description, package2.description);
    };
  };

  type ShippingOption = {
    #standard;
    #express;
    #overnight;
  };

  module ShippingOption {
    public func compare(option1 : ShippingOption, option2 : ShippingOption) : Order.Order {
      switch (option1, option2) {
        case (#standard, #standard) { #equal };
        case (#standard, _) { #less };
        case (#express, #standard) { #greater };
        case (#express, #express) { #equal };
        case (#express, _) { #less };
        case (#overnight, #overnight) { #equal };
        case (#overnight, _) { #greater };
      };
    };
  };

  type TrackingUpdate = {
    status : ParcelStatus;
    timestamp : Time.Time;
    location : Text;
    note : Text;
  };

  type Booking = {
    bookingId : Nat;
    sender : Person;
    receiver : Person;
    package : PackageDetails;
    destination : Text;
    shippingOption : ShippingOption;
    currentStatus : ParcelStatus;
    trackingUpdates : [TrackingUpdate];
    createdAt : Time.Time;
    trackingNumber : TrackingNumber;
  };

  module Booking {
    public func compare(booking1 : Booking, booking2 : Booking) : Order.Order {
      Nat.compare(booking1.bookingId, booking2.bookingId);
    };
  };

  type CreateBookingRequest = {
    sender : Person;
    receiver : Person;
    package : PackageDetails;
    destination : Text;
    shippingOption : ShippingOption;
  };

  type BookingConfirmation = {
    bookingId : Nat;
    trackingNumber : TrackingNumber;
    status : ParcelStatus;
    estimatedDelivery : Text;
    createdAt : Time.Time;
  };

  type UpdateStatusRequest = {
    status : ParcelStatus;
    location : Text;
    note : Text;
  };

  public type UserProfile = {
    name : Text;
    email : Text;
    phone : PhoneNumber;
  };

  let bookings = Map.empty<Text, Booking>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  public shared ({ caller }) func initializeAccessControl() : async () {
    AccessControl.initialize(accessControlState, caller);
  };

  public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller);
  };

  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func createBooking(request : CreateBookingRequest) : async BookingConfirmation {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create bookings");
    };
    let confirmation = createBookingInternal(request, #queued);
    confirmation;
  };

  func createBookingInternal(request : CreateBookingRequest, initialStatus : ParcelStatus) : BookingConfirmation {
    nextBookingId += 1;
    let trackingNumber = generateTrackingNumber();
    let now = Time.now();

    let initialUpdate : TrackingUpdate = {
      status = initialStatus;
      timestamp = now;
      location = "ML Enterprise Mokokchung HQ";
      note = "Booking created";
    };

    let booking : Booking = {
      bookingId = nextBookingId;
      sender = request.sender;
      receiver = request.receiver;
      package = request.package;
      destination = request.destination;
      shippingOption = request.shippingOption;
      currentStatus = initialStatus;
      trackingUpdates = [initialUpdate];
      createdAt = now;
      trackingNumber;
    };

    bookings.add(trackingNumber, booking);

    {
      bookingId = nextBookingId;
      trackingNumber;
      status = initialStatus;
      estimatedDelivery = calculateEstimatedDelivery(request.shippingOption, now);
      createdAt = now;
    };
  };

  public shared ({ caller }) func updateParcelStatus(trackingNumber : TrackingNumber, update : UpdateStatusRequest) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update parcel status");
    };

    let now = Time.now();
    let trackingUpdate : TrackingUpdate = {
      status = update.status;
      timestamp = now;
      location = update.location;
      note = update.note;
    };

    switch (bookings.get(trackingNumber)) {
      case (?booking) {
        let newTrackingUpdates = [trackingUpdate];
        let updatedBooking : Booking = {
          booking with
          currentStatus = update.status;
          trackingUpdates = newTrackingUpdates.concat(booking.trackingUpdates);
        };
        bookings.add(trackingNumber, updatedBooking);
      };
      case (null) {
        Runtime.trap("Booking not found");
      };
    };
  };

  public query ({ caller }) func trackParcel(trackingNumber : TrackingNumber) : async Booking {
    switch (bookings.get(trackingNumber)) {
      case (?booking) {
        booking;
      };
      case (null) {
        Runtime.trap("Booking not found");
      };
    };
  };

  func generateTrackingNumber() : TrackingNumber {
    let timestamp = Time.now();
    "ML" # timestamp.toText() # nextBookingId.toText();
  };

  func calculateEstimatedDelivery(option : ShippingOption, createdAt : Time.Time) : Text {
    let now = Time.now();
    switch (option) {
      case (#standard) { "4-6 days" };
      case (#express) { "2-3 days" };
      case (#overnight) { "24 hours" };
    };
  };

  public query ({ caller }) func isTrackingNumberValid(trackingNumber : TrackingNumber) : async Bool {
    bookings.containsKey(trackingNumber);
  };

  public query ({ caller }) func getUserRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller);
  };

  public shared ({ caller }) func assignUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  public query ({ caller }) func isAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  public query ({ caller }) func getAllBookings() : async [Booking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all bookings");
    };
    bookings.values().toArray().sort();
  };

  public query ({ caller }) func getActiveTrackingNumbers() : async [TrackingNumber] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all tracking numbers");
    };
    bookings.keys().toArray().sort();
  };

  public query ({ caller }) func getStatusHistory(trackingNumber : TrackingNumber) : async [TrackingUpdate] {
    switch (bookings.get(trackingNumber)) {
      case (?booking) {
        booking.trackingUpdates;
      };
      case (null) {
        Runtime.trap("Booking not found");
      };
    };
  };

  public query ({ caller }) func isDelivered(trackingNumber : TrackingNumber) : async Bool {
    switch (bookings.get(trackingNumber)) {
      case (?booking) {
        switch (booking.currentStatus) {
          case (#delivered) { true };
          case (_) { false };
        };
      };
      case (null) {
        Runtime.trap("Booking not found");
      };
    };
  };
};
