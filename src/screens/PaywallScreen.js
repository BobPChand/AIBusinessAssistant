import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  ActivityIndicator, Linking, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const CHECKOUT_URL = 'https://superagent-02ccfade.base44.app/functions/stripeCheckout';

const FEATURES = [
  { icon: 'chatbubble-ellipses', text: 'Unlimited GPT-4o AI Chat' },
  { icon: 'checkmark-done-circle', text: 'Smart Task Management' },
  { icon: 'trending-up', text: 'Business Insights & Analytics' },
  { icon: 'mic', text: 'Voice Input Support' },
  { icon: 'notifications', text: 'Daily AI Morning Briefings' },
  { icon: 'shield-checkmark', text: 'Bank-level Data Encryption' },
];

export default function PaywallScreen({ navigation }) {
  const [selected, setSelected] = useState('monthly');
  const [loading, setLoading] = useState(false);

  const plans = [
    {
      id: 'monthly',
      label: 'Monthly',
      price: 'CA$9.99',
      period: '/month',
      badge: null,
    },
    {
      id: 'yearly',
      label: 'Yearly',
      price: 'CA$79.99',
      period: '/year',
      badge: 'Save 33%',
    },
  ];

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const res = await fetch(CHECKOUT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: selected }),
      });
      const data = await res.json();
      if (data.url) {
        await Linking.openURL(data.url);
      } else {
        Alert.alert('Error', 'Could not start checkout. Please try again.');
      }
    } catch (e) {
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconBadge}>
            <Ionicons name="sparkles" size={32} color="#fff" />
          </View>
          <Text style={styles.title}>AI Business Assistant</Text>
          <Text style={styles.subtitle}>Pro</Text>
          <Text style={styles.trial}>🎉 Start your 7-day FREE trial</Text>
        </View>

        {/* Features */}
        <View style={styles.featuresCard}>
          {FEATURES.map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <View style={styles.featureIcon}>
                <Ionicons name={f.icon} size={18} color="#1E6FD9" />
              </View>
              <Text style={styles.featureText}>{f.text}</Text>
              <Ionicons name="checkmark-circle" size={18} color="#34C759" />
            </View>
          ))}
        </View>

        {/* Plan selector */}
        <View style={styles.plansRow}>
          {plans.map(plan => (
            <TouchableOpacity
              key={plan.id}
              style={[styles.planCard, selected === plan.id && styles.planCardSelected]}
              onPress={() => setSelected(plan.id)}
            >
              {plan.badge && (
                <View style={styles.planBadge}>
                  <Text style={styles.planBadgeText}>{plan.badge}</Text>
                </View>
              )}
              <Text style={[styles.planLabel, selected === plan.id && styles.planLabelSelected]}>{plan.label}</Text>
              <Text style={[styles.planPrice, selected === plan.id && styles.planPriceSelected]}>{plan.price}</Text>
              <Text style={[styles.planPeriod, selected === plan.id && styles.planPeriodSelected]}>{plan.period}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* CTA Button */}
        <TouchableOpacity style={styles.ctaButton} onPress={handleSubscribe} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.ctaText}>Start Free Trial</Text>
              <Text style={styles.ctaSub}>Then {selected === 'monthly' ? 'CA$9.99/month' : 'CA$79.99/year'} · Cancel anytime</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Footer */}
        <Text style={styles.footer}>No charge for 7 days · Secure payment by Stripe · Cancel anytime</Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F4F8' },
  scroll: { padding: 24, paddingBottom: 40 },
  header: { alignItems: 'center', marginBottom: 24 },
  iconBadge: { width: 72, height: 72, borderRadius: 20, backgroundColor: '#1E6FD9', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1C1C1E' },
  subtitle: { fontSize: 18, fontWeight: '700', color: '#1E6FD9' },
  trial: { marginTop: 8, fontSize: 15, color: '#34C759', fontWeight: '600' },
  featuresCard: { backgroundColor: '#fff', borderRadius: 18, padding: 16, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  featureRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 12 },
  featureIcon: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#EBF2FF', justifyContent: 'center', alignItems: 'center' },
  featureText: { flex: 1, fontSize: 15, color: '#1C1C1E' },
  plansRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  planCard: { flex: 1, backgroundColor: '#fff', borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 2, borderColor: 'transparent', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  planCardSelected: { borderColor: '#1E6FD9', backgroundColor: '#EBF2FF' },
  planBadge: { backgroundColor: '#34C759', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, marginBottom: 6 },
  planBadgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  planLabel: { fontSize: 13, color: '#8E8E93', fontWeight: '600' },
  planLabelSelected: { color: '#1E6FD9' },
  planPrice: { fontSize: 22, fontWeight: 'bold', color: '#1C1C1E', marginTop: 4 },
  planPriceSelected: { color: '#1E6FD9' },
  planPeriod: { fontSize: 12, color: '#8E8E93' },
  planPeriodSelected: { color: '#1E6FD9' },
  ctaButton: { backgroundColor: '#1E6FD9', borderRadius: 16, padding: 18, alignItems: 'center', marginBottom: 16, shadowColor: '#1E6FD9', shadowOpacity: 0.3, shadowRadius: 10, elevation: 4 },
  ctaText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  ctaSub: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 4 },
  footer: { textAlign: 'center', fontSize: 12, color: '#8E8E93', lineHeight: 18 },
});
