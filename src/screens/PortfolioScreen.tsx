import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';
import { getPortfolio } from '../services/marketApi';
import { PortfolioHolding } from '../types';

export default function PortfolioScreen() {
  const [holdings, setHoldings] = useState<PortfolioHolding[]>([]);

  useEffect(() => {
    const load = async () => {
      setHoldings(await getPortfolio());
    };

    load();
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      <Text style={styles.title}>Portfolio</Text>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Net Value</Text>
        <Text style={styles.summaryValue}>₹4,82,640</Text>
        <Text style={[styles.summaryDelta, styles.positive]}>+₹18,400 (4.1%)</Text>
      </View>

      {holdings.map((holding) => {
        const value = holding.shares * holding.currentPrice;
        return (
          <View key={holding.symbol} style={styles.holdingRow}>
            <View>
              <Text style={styles.symbol}>{holding.symbol}</Text>
              <Text style={styles.meta}>{holding.shares} shares</Text>
            </View>
            <View style={styles.rightBlock}>
              <Text style={styles.value}>₹{value.toLocaleString()}</Text>
              <Text style={[styles.alloc, holding.allocation >= 20 ? styles.positive : styles.negative]}>
                {holding.allocation}% allocation
              </Text>
            </View>
          </View>
        );
      })}
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
  summaryCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
  },
  summaryLabel: {
    color: colors.muted,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  summaryValue: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
    marginTop: 8,
  },
  summaryDelta: {
    fontSize: 13,
    marginTop: 8,
    fontWeight: '700',
  },
  holdingRow: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  symbol: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  meta: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 4,
  },
  rightBlock: {
    alignItems: 'flex-end',
  },
  value: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  alloc: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '700',
  },
  positive: {
    color: colors.green,
  },
  negative: {
    color: colors.red,
  },
});
