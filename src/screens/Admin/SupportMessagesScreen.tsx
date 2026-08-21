import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';

import type { AdminStackParamList } from '../../navigation/AdminNavigator';
import {
  useSupport,
  type SupportMessage,
} from '../../context/SupportContext';
import FancyAlert from '../../components/FancyAlert';

type Props = NativeStackScreenProps<AdminStackParamList, 'HelpSupport'>;

type Filter = 'All' | 'Open' | 'Resolved';

const BLUE = '#2E6BFF';
const BLUE_TINT = '#E4EEFF';
const GREEN = '#00A85A';
const GREEN_TINT = '#DDF8E8';
const AMBER = '#E8960C';
const AMBER_TINT = '#FFF0B8';
const TEXT_DARK = '#1F2933';
const TEXT_MUTED = '#7A869A';
const BORDER = '#E8ECF1';
const WHITE = '#FFFFFF';
const DANGER = '#E5484D';

const GRADIENT_VIBRANT = ['#2E6BFF', '#7857FF'] as const;

const AVATAR_PALETTE = [
  { badgeColor: '#EFEBFF', initialsColor: '#7857FF' },
  { badgeColor: '#D6F0F4', initialsColor: '#0E9AA7' },
  { badgeColor: '#DDF8E8', initialsColor: '#00A85A' },
  { badgeColor: '#FFF0B8', initialsColor: '#E8960C' },
];

const isWeb = Platform.OS === 'web';

function initialsFor(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

export default function SupportMessagesScreen({ navigation }: Props) {
  const { messages, loading, updateMessageStatus, deleteMessage } = useSupport();
  const [searchText, setSearchText] = useState('');
  const [filter, setFilter] = useState<Filter>('All');
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<SupportMessage | null>(null);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [success, setSuccess] = useState<{
    visible: boolean;
    title: string;
    message: string;
  }>({ visible: false, title: '', message: '' });

  const filteredMessages = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();

    return messages.filter((message) => {
      const matchesFilter =
        filter === 'All' || message.status === filter;
      if (!matchesFilter) return false;
      if (!normalizedSearch) return true;
      return (
        message.customerName.toLowerCase().includes(normalizedSearch) ||
        message.subject.toLowerCase().includes(normalizedSearch) ||
        message.message.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [messages, searchText, filter]);

  if (!fontsLoaded) return null;

  const openCount = messages.filter((m) => m.status === 'Open').length;

  const handleToggleStatus = async () => {
    if (!selectedMessage) return;
    const nextStatus =
      selectedMessage.status === 'Open' ? 'Resolved' : 'Open';
    await updateMessageStatus(selectedMessage.id, nextStatus);
    setDetailVisible(false);
    setSelectedMessage(null);
    setSuccess({
      visible: true,
      title: nextStatus === 'Resolved' ? 'Marked as resolved' : 'Reopened',
      message:
        nextStatus === 'Resolved'
          ? 'The support message has been marked as resolved.'
          : 'The support message has been reopened.',
    });
  };

  const handleConfirmDelete = async () => {
    if (selectedMessage) {
      await deleteMessage(selectedMessage.id);
    }
    setDeleteVisible(false);
    setDetailVisible(false);
    setSelectedMessage(null);
    setSuccess({
      visible: true,
      title: 'Message removed',
      message: 'The support message has been deleted.',
    });
  };

  const renderMessage = ({ item }: { item: SupportMessage }) => {
    const palette =
      AVATAR_PALETTE[item.customerName.length % AVATAR_PALETTE.length];
    const isOpen = item.status === 'Open';
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.85}
        onPress={() => {
          setSelectedMessage(item);
          setDetailVisible(true);
        }}
      >
        <View style={[styles.avatar, { backgroundColor: palette.badgeColor }]}>
          <Text style={[styles.avatarText, { color: palette.initialsColor }]}>
            {initialsFor(item.customerName)}
          </Text>
        </View>

        <View style={styles.messageDetails}>
          <View style={styles.nameRow}>
            <Text style={styles.customerName} numberOfLines={1}>
              {item.customerName}
            </Text>
            <View
              style={[
                styles.statusBadge,
                isOpen ? styles.statusOpen : styles.statusResolved,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  { color: isOpen ? AMBER : GREEN },
                ]}
              >
                {item.status}
              </Text>
            </View>
          </View>
          <Text style={styles.subject} numberOfLines={1}>
            {item.subject}
          </Text>
          <Text style={styles.snippet} numberOfLines={1}>
            {item.message}
          </Text>
        </View>

        <View style={styles.metaDetails}>
          <Text style={styles.timeText}>{timeAgo(item.createdAt)}</Text>
        </View>

        <MaterialCommunityIcons name="chevron-right" size={20} color={TEXT_MUTED} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={GRADIENT_VIBRANT} style={styles.headerBanner}>
        <View style={styles.shine} />
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerIcon}
            onPress={() => navigation.goBack()}
          >
            <MaterialCommunityIcons name="arrow-left" size={22} color={WHITE} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Help & Support</Text>
          <View style={styles.headerIconPlaceholder} />
        </View>
      </LinearGradient>

      <FlatList
        data={filteredMessages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <View style={styles.summaryCard}>
              <View style={[styles.summaryIcon, { backgroundColor: AMBER_TINT }]}>
                <MaterialCommunityIcons
                  name="email-alert-outline"
                  size={20}
                  color={AMBER}
                />
              </View>
              <View style={styles.summaryBody}>
                <Text style={styles.summaryTitle}>
                  {openCount} open {openCount === 1 ? 'message' : 'messages'}
                </Text>
                <Text style={styles.summarySubtitle}>
                  Messages written by customers appear here.
                </Text>
              </View>
            </View>

            <View style={styles.searchWrap}>
              <View style={styles.searchIconChip}>
                <MaterialCommunityIcons name="magnify" size={18} color={BLUE} />
              </View>
              <TextInput
                style={styles.searchInput}
                value={searchText}
                onChangeText={setSearchText}
                placeholder="Search messages..."
                placeholderTextColor={TEXT_MUTED}
                autoCapitalize="none"
              />
              {searchText.length > 0 && (
                <TouchableOpacity onPress={() => setSearchText('')}>
                  <MaterialCommunityIcons name="close-circle" size={18} color={TEXT_MUTED} />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.filterRow}>
              {(['All', 'Open', 'Resolved'] as Filter[]).map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[styles.filterChip, filter === option && styles.filterChipActive]}
                  activeOpacity={0.85}
                  onPress={() => setFilter(option)}
                >
                  <Text
                    style={[
                      styles.filterText,
                      filter === option && styles.filterTextActive,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.resultsText}>
              {filteredMessages.length}{' '}
              {filteredMessages.length === 1 ? 'message' : 'messages'}
            </Text>
          </>
        }
        ListEmptyComponent={
          loading ? (
            <View style={styles.empty}>
              <ActivityIndicator size="large" color={BLUE} />
            </View>
          ) : (
            <View style={styles.empty}>
              <View style={styles.emptyIconWrap}>
                <MaterialCommunityIcons name="email-open-outline" size={48} color={BLUE} />
              </View>
              <Text style={styles.emptyTitle}>No messages found</Text>
              <Text style={styles.emptySubtitle}>
                Customer support messages will show up here.
              </Text>
            </View>
          )
        }
      />

      <Modal
        visible={detailVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDetailVisible(false)}
      >
        <View style={styles.detailOverlay}>
          <View style={styles.detailCard}>
            <TouchableOpacity
              style={styles.detailClose}
              onPress={() => setDetailVisible(false)}
            >
              <MaterialCommunityIcons name="close" size={18} color={TEXT_MUTED} />
            </TouchableOpacity>

            {selectedMessage && (
              <>
                <View style={styles.detailAvatar}>
                  <Text style={styles.detailAvatarText}>
                    {initialsFor(selectedMessage.customerName)}
                  </Text>
                </View>
                <Text style={styles.detailName}>{selectedMessage.customerName}</Text>
                <Text style={styles.detailEmail}>{selectedMessage.customerEmail}</Text>

                <View style={styles.detailInfoCard}>
                  <View style={styles.detailInfoRow}>
                    <MaterialCommunityIcons
                      name="tag-outline"
                      size={16}
                      color={BLUE}
                    />
                    <Text style={styles.detailInfoLabel}>Subject</Text>
                    <Text style={styles.detailInfoValue} numberOfLines={2}>
                      {selectedMessage.subject}
                    </Text>
                  </View>
                  <View style={styles.detailDivider} />
                  <View style={styles.detailMessageWrap}>
                    <View style={styles.detailInfoRow}>
                      <MaterialCommunityIcons
                        name="message-text-outline"
                        size={16}
                        color={BLUE}
                      />
                      <Text style={styles.detailInfoLabel}>Message</Text>
                    </View>
                    <Text style={styles.detailMessageBody}>
                      {selectedMessage.message}
                    </Text>
                  </View>
                  <View style={styles.detailDivider} />
                  <View style={styles.detailInfoRow}>
                    <MaterialCommunityIcons
                      name="clock-outline"
                      size={16}
                      color={BLUE}
                    />
                    <Text style={styles.detailInfoLabel}>Received</Text>
                    <Text style={styles.detailInfoValue}>
                      {timeAgo(selectedMessage.createdAt)}
                    </Text>
                  </View>
                </View>

                <View style={styles.detailActions}>
                  <TouchableOpacity
                    style={styles.resolveButton}
                    activeOpacity={0.85}
                    onPress={handleToggleStatus}
                  >
                    <LinearGradient
                      colors={GRADIENT_VIBRANT}
                      style={styles.resolveGradient}
                    >
                      <MaterialCommunityIcons
                        name={
                          selectedMessage.status === 'Open'
                            ? 'check-all'
                            : 'email-open-outline'
                        }
                        size={18}
                        color={WHITE}
                      />
                      <Text style={styles.resolveText}>
                        {selectedMessage.status === 'Open'
                          ? 'Mark Resolved'
                          : 'Reopen'}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    activeOpacity={0.85}
                    onPress={() => setDeleteVisible(true)}
                  >
                    <MaterialCommunityIcons name="delete-outline" size={18} color={DANGER} />
                    <Text style={styles.deleteText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      <Modal
        visible={deleteVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteVisible(false)}
      >
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmCard}>
            <View style={styles.confirmIcon}>
              <MaterialCommunityIcons name="delete-outline" size={28} color={DANGER} />
            </View>
            <Text style={styles.confirmTitle}>Delete message</Text>
            <Text style={styles.confirmMessage}>
              Are you sure you want to delete this support message? This action
              cannot be undone.
            </Text>
            <View style={styles.confirmActions}>
              <TouchableOpacity
                style={styles.confirmCancelButton}
                onPress={() => setDeleteVisible(false)}
              >
                <Text style={styles.confirmCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmDeleteButton}
                onPress={handleConfirmDelete}
              >
                <Text style={styles.confirmDeleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <FancyAlert
        visible={success.visible}
        icon={success.title === 'Message removed' ? 'delete-outline' : 'check-circle-outline'}
        iconColor={success.title === 'Message removed' ? '#C2383C' : '#0B7A50'}
        iconBackground={success.title === 'Message removed' ? '#FDE7E8' : '#DDF8E8'}
        title={success.title}
        message={success.message}
        onClose={() => setSuccess((prev) => ({ ...prev, visible: false }))}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: WHITE,
  },
  headerBanner: {
    marginBottom: 14,
  },
  shine: {
    position: 'absolute',
    top: -30,
    left: -30,
    width: 90,
    height: 120,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    transform: [{ rotate: '20deg' }],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIconPlaceholder: {
    width: 40,
  },
  headerTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    color: WHITE,
  },
  listContent: {
    paddingHorizontal: isWeb ? 32 : 20,
    paddingBottom: 40,
    ...(isWeb ? { maxWidth: 700, alignSelf: 'center', width: '100%' } : {}),
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WHITE,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 14,
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#26384A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  summaryIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  summaryBody: {
    flex: 1,
  },
  summaryTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: TEXT_DARK,
  },
  summarySubtitle: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
    color: TEXT_MUTED,
    marginTop: 2,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 16,
    paddingHorizontal: 10,
    height: 50,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#26384A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  searchIconChip: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: BLUE_TINT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: TEXT_DARK,
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: WHITE,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: BLUE,
    borderColor: BLUE,
  },
  filterText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
    color: TEXT_MUTED,
  },
  filterTextActive: {
    color: WHITE,
  },
  resultsText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: TEXT_MUTED,
    marginBottom: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WHITE,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#26384A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
  },
  messageDetails: {
    flex: 1,
    marginRight: 8,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  customerName: {
    flexShrink: 1,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: TEXT_DARK,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusOpen: {
    backgroundColor: AMBER_TINT,
  },
  statusResolved: {
    backgroundColor: GREEN_TINT,
  },
  statusText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 9,
  },
  subject: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
    color: BLUE,
    marginTop: 4,
  },
  snippet: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
    color: TEXT_MUTED,
    marginTop: 2,
  },
  metaDetails: {
    alignItems: 'flex-end',
    marginRight: 6,
  },
  timeText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 10,
    color: TEXT_MUTED,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyIconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: BLUE_TINT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 17,
    color: TEXT_DARK,
    marginTop: 14,
  },
  emptySubtitle: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    color: TEXT_MUTED,
    marginTop: 6,
    textAlign: 'center',
  },
  detailOverlay: {
    flex: 1,
    backgroundColor: 'rgba(18, 38, 58, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  detailCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: WHITE,
    borderRadius: 24,
    paddingHorizontal: 22,
    paddingVertical: 24,
    alignItems: 'center',
  },
  detailClose: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F6F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailAvatar: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: BLUE_TINT,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailAvatarText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 24,
    color: BLUE,
  },
  detailName: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    color: TEXT_DARK,
  },
  detailEmail: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: TEXT_MUTED,
    marginTop: 2,
  },
  detailInfoCard: {
    alignSelf: 'stretch',
    backgroundColor: '#F9FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 16,
  },
  detailInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  detailInfoLabel: {
    marginLeft: 8,
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
    color: TEXT_MUTED,
  },
  detailInfoValue: {
    flex: 1,
    textAlign: 'right',
    marginLeft: 8,
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
    color: TEXT_DARK,
  },
  detailDivider: {
    alignSelf: 'stretch',
    height: 1,
    backgroundColor: BORDER,
  },
  detailMessageWrap: {
    paddingVertical: 6,
  },
  detailMessageBody: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    lineHeight: 20,
    color: TEXT_DARK,
    marginTop: 6,
  },
  detailActions: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    marginTop: 18,
  },
  resolveButton: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
    marginRight: 10,
  },
  resolveGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 14,
  },
  resolveText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
    color: WHITE,
    marginLeft: 6,
  },
  deleteButton: {
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#FDE7E8',
    backgroundColor: '#FFF5F5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
    color: DANGER,
    marginLeft: 6,
  },
  confirmOverlay: {
    flex: 1,
    backgroundColor: 'rgba(18, 38, 58, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  confirmCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  confirmIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FDE7E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  confirmTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    color: TEXT_DARK,
  },
  confirmMessage: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    color: TEXT_MUTED,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
  },
  confirmActions: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 22,
  },
  confirmCancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: BORDER,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  confirmCancelText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: TEXT_DARK,
  },
  confirmDeleteButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: DANGER,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  confirmDeleteText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: WHITE,
  },
});
