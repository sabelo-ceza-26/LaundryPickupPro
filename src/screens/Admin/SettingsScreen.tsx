import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { AdminStackParamList } from '../../navigation/AdminNavigator';

type Props = NativeStackScreenProps<AdminStackParamList, 'Settings'>;

export default function SettingsScreen({ navigation }: Props) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [orderAlertsEnabled, setOrderAlertsEnabled] = useState(true);
  const [driverAlertsEnabled, setDriverAlertsEnabled] = useState(true);
  const [emailReportsEnabled, setEmailReportsEnabled] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Log out',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Log out',
          style: 'destructive',
          onPress: () => navigation.replace('Login'),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Settings</Text>

          <View style={styles.headerPlaceholder} />
        </View>

        <View style={styles.profileCard}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>A</Text>
          </View>

          <View style={styles.profileDetails}>
            <Text style={styles.profileName}>Admin</Text>
            <Text style={styles.profileEmail}>admin@gmail.com</Text>
            <Text style={styles.profileRole}>System Administrator</Text>
          </View>

          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                'Edit profile',
                'You may edit profile.'
              )
            }
          >
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Account</Text>

        <View style={styles.settingsCard}>
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() =>
              Alert.alert(
                'Personal information',
              )
            }
          >
            <View>
              <Text style={styles.settingTitle}>
                Personal Information
              </Text>
              <Text style={styles.settingSubtitle}>
                Update your name and email address
              </Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.settingRow}
            onPress={() =>
              Alert.alert(
                'Change password',
                'A link has been sent to your email'
              )
            }
          >
            <View>
              <Text style={styles.settingTitle}>Change Password</Text>
              <Text style={styles.settingSubtitle}>
                Update your account password
              </Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Notifications</Text>

        <View style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View style={styles.switchTextContainer}>
              <Text style={styles.settingTitle}>Push Notifications</Text>
              <Text style={styles.settingSubtitle}>
                Receive notifications on this device
              </Text>
            </View>

            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{
                false: '#D8DEE6',
                true: '#9EB5EB',
              }}
              thumbColor={
                notificationsEnabled ? '#173D8F' : '#F4F4F4'
              }
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.switchTextContainer}>
              <Text style={styles.settingTitle}>Order Alerts</Text>
              <Text style={styles.settingSubtitle}>
                Receive updates about customer orders
              </Text>
            </View>

            <Switch
              value={orderAlertsEnabled}
              onValueChange={setOrderAlertsEnabled}
              trackColor={{
                false: '#D8DEE6',
                true: '#9EB5EB',
              }}
              thumbColor={orderAlertsEnabled ? '#173D8F' : '#F4F4F4'}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.switchTextContainer}>
              <Text style={styles.settingTitle}>Driver Alerts</Text>
              <Text style={styles.settingSubtitle}>
                Receive driver availability updates
              </Text>
            </View>

            <Switch
              value={driverAlertsEnabled}
              onValueChange={setDriverAlertsEnabled}
              trackColor={{
                false: '#D8DEE6',
                true: '#9EB5EB',
              }}
              thumbColor={driverAlertsEnabled ? '#173D8F' : '#F4F4F4'}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.switchTextContainer}>
              <Text style={styles.settingTitle}>Email Reports</Text>
              <Text style={styles.settingSubtitle}>
                Receive weekly performance reports
              </Text>
            </View>

            <Switch
              value={emailReportsEnabled}
              onValueChange={setEmailReportsEnabled}
              trackColor={{
                false: '#D8DEE6',
                true: '#9EB5EB',
              }}
              thumbColor={emailReportsEnabled ? '#173D8F' : '#F4F4F4'}
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Application</Text>

        <View style={styles.settingsCard}>
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() =>
              Alert.alert(
                'Privacy Policy',
                'The privacy policy displayed here.'
              )
            }
          >
            <Text style={styles.settingTitle}>Privacy Policy</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.settingRow}
            onPress={() =>
              Alert.alert(
                'Help and Support',
                'Contact support at support@laundrypickuppro.co.za.'
              )
            }
          >
            <Text style={styles.settingTitle}>Help and Support</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <Text style={styles.settingTitle}>App Version</Text>
            <Text style={styles.versionText}>1.0.0</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },

  container: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 35,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },

  backButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
  },

  backText: {
    fontSize: 34,
    color: '#12263A',
    lineHeight: 34,
  },

  title: {
    fontSize: 19,
    fontWeight: '700',
    color: '#12263A',
  },

  headerPlaceholder: {
    width: 36,
  },

  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
    elevation: 2,
  },

  profileAvatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#173D8F',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 13,
  },

  profileAvatarText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },

  profileDetails: {
    flex: 1,
  },

  profileName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#12263A',
  },

  profileEmail: {
    marginTop: 4,
    fontSize: 12,
    color: '#667085',
  },

  profileRole: {
    marginTop: 3,
    fontSize: 10,
    color: '#98A1AE',
  },

  editText: {
    color: '#173D8F',
    fontSize: 12,
    fontWeight: '700',
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#667085',
    marginBottom: 9,
    marginLeft: 2,
  },

  settingsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 15,
    marginBottom: 21,
    elevation: 2,
  },

  settingRow: {
    minHeight: 67,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },

  switchTextContainer: {
    flex: 1,
    paddingRight: 15,
  },

  settingTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#12263A',
  },

  settingSubtitle: {
    marginTop: 4,
    fontSize: 10,
    color: '#87909C',
  },

  divider: {
    height: 1,
    backgroundColor: '#EDF0F3',
  },

  arrow: {
    fontSize: 25,
    color: '#8A94A3',
  },

  versionText: {
    fontSize: 12,
    color: '#87909C',
  },

  logoutButton: {
    height: 52,
    backgroundColor: '#FFF1F1',
    borderWidth: 1,
    borderColor: '#F5CCCC',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoutText: {
    color: '#D14343',
    fontSize: 14,
    fontWeight: '700',
  },
});