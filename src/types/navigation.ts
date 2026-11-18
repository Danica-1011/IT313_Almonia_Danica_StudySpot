import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

// Bottom Tab Param List
export type TabParamList = {
  Explore: undefined;
  Bookings: undefined;
  Profile: undefined;
};

// Root Stack Param List (Only pass spaceId, never full objects)
export type RootStackParamList = {
  Login: undefined;
  Main: NavigatorScreenParams<TabParamList>;
  SpaceDetails: { spaceId: string };
  BookingModal: { spaceId: string };
};

// Typed Screen Props
export type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;
export type SpaceDetailsScreenProps = NativeStackScreenProps<RootStackParamList, 'SpaceDetails'>;
export type BookingModalScreenProps = NativeStackScreenProps<RootStackParamList, 'BookingModal'>;

export type ExploreScreenProps = BottomTabScreenProps<TabParamList, 'Explore'>;
export type BookingsTabProps = BottomTabScreenProps<TabParamList, 'Bookings'>;
export type ProfileTabProps = BottomTabScreenProps<TabParamList, 'Profile'>;