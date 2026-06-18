import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet, ScrollView, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';

export default function SettingsScreen() {
  const [dailyBriefing, setDailyBriefing] = useState(false);
  const [taskReminders, setTaskReminders] = useState(true);

  const toggleDailyBriefing = async (val) => {
    setDailyBriefing(val);
    if (val) {
      await Notifications.scheduleNotificationAsync({
        content: { title: '🧠 Good Morning, Bob!', body: 'Your AI Business Assistant is ready. Let\'s conquer today!', sound: true },
        trigger: { hour: 8, minute: 0, repeats: true },
      });
    } else {
      await Notifications.cancelAllScheduledNotificationsAsync();
    }
  };

  const rows = [
    { icon: 'person-circle', label: 'Name', value: 'Bob Chand', color: '#4A90E2' },
    { icon: 'globe', label: 'Website', value: 'AIBusinessAssistant.ai', color: '#4A90E2' },
    { icon: 'brain', label: 'AI Model', value: 'GPT-4o', color: '#9B59B6' },
    { icon: 'lock-closed', label: 'Privacy', value: 'Encrypted', color: '#7ED321' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>BC</Text>
          </View>
          <View>
            <Text style={styles.name}>Bob Chand</Text>
            <Text style={styles.site}>AIBusinessAssistant.ai</Text>
          </View>
        </View>

        {/* Info rows */}
        <View style={styles.section}>
          {rows.map(row => (
            <View key={row.label} style={styles.row}>
              <Ionicons name={row.icon} size={20} color={row.color} />
              <Text style={styles.rowLabel}>{row.label}</Text>
              <Text style={styles.rowValue}>{row.value}</Text>
            </View>
          ))}
        </View>

        {/* Notifications */}
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.section}>
          <View style={styles.row}>
            <Ionicons name="sunrise" size={20} color="#F5A623" />
            <Text style={styles.rowLabel}>Daily Morning Briefing</Text>
            <Switch value={dailyBriefing} onValueChange={toggleDailyBriefing} trackColor={{ true: '#4A90E2' }} />
          </View>
          <View style={styles.row}>
            <Ionicons name="alarm" size={20} color="#FF3B30" />
            <Text style={styles.rowLabel}>Task Reminders</Text>
            <Switch value={taskReminders} onValueChange={setTaskReminders} trackColor={{ true: '#4A90E2' }} />
          </View>
        </View>

        {/* About */}
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.section}>
          <View style={styles.row}>
            <Ionicons name="information-circle" size={20} color="#4A90E2" />
            <Text style={styles.rowLabel}>Version</Text>
            <Text style={styles.rowValue}>1.0.0</Text>
          </View>
          <TouchableOpacity style={styles.row} onPress={() => Linking.openURL('https://aibusinessassistant.ai')}>
            <Ionicons name="globe" size={20} color="#4A90E2" />
            <Text style={styles.rowLabel}>Visit Website</Text>
            <Ionicons name="chevron-forward" size={16} color="#8E8E93" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A1628' },
  scroll: { padding: 20 },
  profileCard: { flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: '#1C2E4A', borderRadius: 16, padding: 20, marginBottom: 20 },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#4A90E2', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  name: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  site: { color: '#8E8E93', fontSize: 13, marginTop: 2 },
  sectionTitle: { color: '#8E8E93', fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10, marginTop: 8 },
  section: { backgroundColor: '#1C2E4A', borderRadius: 16, overflow: 'hidden', marginBottom: 20 },
  row: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12, borderBottomWidth: 1, borderBottomColor: '#0A1628' },
  rowLabel: { flex: 1, color: '#fff', fontSize: 15 },
  rowValue: { color: '#8E8E93', fontSize: 14 },
});
