import type { CompositeNavigationProp } from '@react-navigation/native';
import type { NavigatorScreenParams } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { CustomerOrder } from '../data/orders';

export type CustomerTabParamList = {
  Home: undefined;
  Orders: undefined;
  Book: undefined;
  Track: { order?: CustomerOrder } | undefined;
  Profile: undefined;
};

export type CustomerStackParamList = {
  Main: NavigatorScreenParams<CustomerTabParamList> | undefined;
  Notifications: undefined;
  OrderDetails: { order: CustomerOrder };
  Addresses: undefined;
  Settings: undefined;
  Support: undefined;
};

export type CustomerTabNavigation = CompositeNavigationProp<
  BottomTabNavigationProp<CustomerTabParamList>,
  NativeStackNavigationProp<CustomerStackParamList>
>;
