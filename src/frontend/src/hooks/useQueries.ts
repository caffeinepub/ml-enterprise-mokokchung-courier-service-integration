import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { 
  CreateBookingRequest, 
  BookingConfirmation, 
  Booking, 
  TrackingNumber, 
  UpdateStatusRequest,
  TrackingUpdate,
  UserProfile,
  UserRole
} from '../backend';
import { Principal } from '@icp-sdk/core/principal';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useCreateBooking() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<BookingConfirmation, Error, CreateBookingRequest>({
    mutationFn: async (request: CreateBookingRequest) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createBooking(request);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allBookings'] });
      queryClient.invalidateQueries({ queryKey: ['trackingNumbers'] });
    },
  });
}

export function useTrackParcel(trackingNumber: TrackingNumber | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Booking | null>({
    queryKey: ['parcel', trackingNumber],
    queryFn: async () => {
      if (!actor || !trackingNumber) return null;
      try {
        return await actor.trackParcel(trackingNumber);
      } catch (error) {
        return null;
      }
    },
    enabled: !!actor && !actorFetching && !!trackingNumber,
    retry: false,
  });
}

export function useGetAllBookings() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Booking[]>({
    queryKey: ['allBookings'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllBookings();
      } catch (error) {
        return [];
      }
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useUpdateParcelStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ trackingNumber, update }: { trackingNumber: TrackingNumber; update: UpdateStatusRequest }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateParcelStatus(trackingNumber, update);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['allBookings'] });
      queryClient.invalidateQueries({ queryKey: ['parcel', variables.trackingNumber] });
      queryClient.invalidateQueries({ queryKey: ['statusHistory', variables.trackingNumber] });
    },
  });
}

export function useGetStatusHistory(trackingNumber: TrackingNumber | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<TrackingUpdate[]>({
    queryKey: ['statusHistory', trackingNumber],
    queryFn: async () => {
      if (!actor || !trackingNumber) return [];
      try {
        return await actor.getStatusHistory(trackingNumber);
      } catch (error) {
        return [];
      }
    },
    enabled: !!actor && !actorFetching && !!trackingNumber,
  });
}

export function useIsAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isCallerAdmin();
      } catch (error) {
        return false;
      }
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetUserRole() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<UserRole>({
    queryKey: ['userRole'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !actorFetching,
  });
}
