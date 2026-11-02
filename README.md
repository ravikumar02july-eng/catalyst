import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { colors } from '../theme';
import { getCandlesForSymbol } from '../services/marketApi';
import { Stock } from '../types';

type StockDetailRouteParams = {
  symbol: string;
  name?: string;
};

export default function StockDetailScreen({ route }: { route: { params: StockDetailRouteParams } }) {
  const { symbol } = route.params;
  const [series, setSeries] = useState<number[]>([]);

  useEffect(() => {
    const load = async () => {
      setSeries(await getCandlesForSymbol(symbol));
    };

    load();
  }, [symbol]);

  const stock = {
    symbol,
    price: 218.72,
    change: 6.94,
    changePercent: 3.28,
    name: 'Apple Inc.',
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.name}>{stock.name}</Text>
      <Text style={styles.symbol}>{stock.symbol}</Text>

      <View style={styles.priceRow}>
        <Text style={styles.price}>${stock.price.toFixed(2)}</Text>
        <Text style={[styles.change, stock.changePercent >= 0 ? styles.positive : styles.negative]}>
          {stock.changePercent >= 0 ? '+' : ''}
          {stock.changePercent.toFixed(2)}%
        </Text>
      </View>

      <View style={styles.chartCard}>
        <LineChart
          data={{
            labels: ['1D', '2D', '3D', '4D', '5D', '6D', '7D'],
            datasets: [{ data: series }],
          }}
          width={340}
          height={220}
          chartConfig={{
            backgroundColor: colors.card,
            backgroundGradientFrom: colors.card,
            backgroundGradientTo: colors.card,
            decimalPlaces: 0,
            color: () => colors.blue,
            labelColor: () => colors.muted,
            strokeWidth: 3,
            propsForDots: { r: '0' },
            propsForBackgroundLines: { stroke: colors.border },
          }}
          bezier
          style={{ borderRadius: 18 }}
          withHorizontalLines={false}
          withVerticalLines={false}
        />
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Open</Text>
          <Text style={styles.statValue}>$214.10</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>High</Text>
          <Text style={styles.statValue}>$220.14</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Low</Text>
          <Text style={styles.statValue}>$211.90</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Volume</Text>
          <Text style={styles.statValue}>66.5M</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 18,
    paddingTop: 20,
  },
  name: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '700',
  },
  symbol: {
    color: colors.muted,
    fontSize: 14,
    letterSpacing: 1,
    marginTop: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 18,
    marginBottom: 18,
  },
  price: {
    color: colors.text,
    fontSize: 36,
    fontWeight: '800',
  },
  change: {
    fontSize: 18,
    fontWeight: '700',
  },
  chartCard: {
    backgroundColor: colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 10,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 18,
    gap: 12,
  },
  statCard: {
    width: '48%',
    backgroundColor: colors.panel,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
  },
  statLabel: {
    color: colors.muted,
    fontSize: 12,
    marginBottom: 8,
  },
  statValue: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  positive: {
    color: colors.green,
  },
  negative: {
    color: colors.red,
  },
});
