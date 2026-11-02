import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';
import { getAlerts } from '../services/marketApi';
import { AlertItem } from '../types';

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  useEffect(() => {
    const load = async () => {
      setAlerts(await getAlerts());
    };

    load();
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      <Text style={styles.title}>Alerts</Text>

      {alerts.map((alert) => (
        <View key={alert.id} style={styles.alertRow}>
          <View>
            <Text style={styles.symbol}>{alert.symbol}</Text>
            <Text style={styles.condition}>{alert.condition}</Text>
          </View>

          <View style={styles.rightPane}>
            <View style={[styles.statusDot, alert.active ? styles.active : styles.inactive]} />
            <Text style={[styles.statusText, alert.active ? styles.activeText : styles.inactiveText]}>
              {alert.active ? 'Active' : 'Idle'}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 18,
    paddingTop: 28,
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 18,
  },
  alertRow: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  symbol: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  condition: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 4,
  },
  rightPane: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    marginBottom: 6,
  },
  active: {
    backgroundColor: colors.green,
  },
  inactive: {
    backgroundColor: colors.red,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  activeText: {
    color: colors.green,
  },
  inactiveText: {
    color: colors.red,
  },
});
