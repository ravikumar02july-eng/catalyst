import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';
import { colors } from '../theme';
import { getMarketOverview, getWatchlist } from '../services/marketApi';
import { MarketOverview, Stock } from '../types';

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [overview, setOverview] = useState<MarketOverview[]>([]);
  const [watchlist, setWatchlist] = useState<Stock[]>([]);

  useEffect(() => {
    const load = async () => {
      setOverview(await getMarketOverview());
      setWatchlist(await getWatchlist());
    };

    load();
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.label}>Market</Text>
          <Text style={styles.title}>Catalyst</Text>
        </View>
        <TouchableOpacity style={styles.headerButton}>
          <Text style={styles.buttonText}>Alerts</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.topChartCard}>
        <Text style={styles.cardTitle}>Market trend</Text>
        <LineChart
          data={{
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            datasets: [{ data: [24400, 24510, 24480, 24640, 24540, 24410] }],
          }}
          width={330}
          height={170}
          chartConfig={{
            backgroundColor: colors.card,
            backgroundGradientFrom: colors.card,
            backgroundGradientTo: colors.card,
            decimalPlaces: 0,
            color: () => colors.green,
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

      <View style={styles.gridRow}>
        {overview.map((item) => (
          <View key={item.index} style={styles.metricCard}>
            <Text style={styles.metricLabel}>{item.index}</Text>
            <Text style={styles.metricValue}>{item.value.toLocaleString()}</Text>
            <Text style={[styles.metricTrend, item.changePercent >= 0 ? styles.positive : styles.negative]}>
              {item.changePercent >= 0 ? '+' : ''}
              {item.changePercent.toFixed(2)}%
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Watchlist</Text>
        <TouchableOpacity>
          <Text style={styles.linkText}>View all</Text>
        </TouchableOpacity>
      </View>

      {watchlist.map((stock) => (
        <TouchableOpacity
          key={stock.symbol}
          style={styles.stockRow}
          onPress={() => navigation.navigate('StockDetail', { symbol: stock.symbol })}
        >
          <View style={styles.stockMain}>
            <View>
              <Text style={styles.stockSymbol}>{stock.symbol}</Text>
              <Text style={styles.stockName}>{stock.name}</Text>
            </View>
            <Text style={styles.stockPrice}>₹{stock.price.toLocaleString()}</Text>
          </View>
          <View style={styles.stockMeta}>
            <Text style={[styles.stockDelta, stock.changePercent >= 0 ? styles.positive : styles.negative]}>
              {stock.changePercent >= 0 ? '+' : ''}
              {stock.changePercent.toFixed(2)}%
            </Text>
            <Text style={styles.stockVolume}>{stock.volume.toLocaleString()} Vol</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 18,
    paddingTop: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  label: {
    color: colors.muted,
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.text,
    fontSize: 34,
    fontWeight: '800',
  },
  headerButton: {
    backgroundColor: colors.panel,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonText: {
    color: colors.text,
    fontWeight: '700',
  },
  topChartCard: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 18,
  },
  cardTitle: {
    color: colors.text,
    fontWeight: '700',
    marginBottom: 12,
    fontSize: 16,
  },
  gridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 18,
  },
  metricCard: {
    width: '48%',
    backgroundColor: colors.panel,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  metricLabel: {
    color: colors.muted,
    fontSize: 12,
    marginBottom: 8,
  },
  metricValue: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '700',
  },
  metricTrend: {
    fontSize: 12,
    marginTop: 8,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  linkText: {
    color: colors.blue,
    fontWeight: '600',
  },
  stockRow: {
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  stockMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stockSymbol: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  stockName: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 2,
  },
  stockPrice: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  stockMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stockDelta: {
    fontWeight: '700',
    fontSize: 12,
  },
  stockVolume: {
    color: colors.muted,
    fontSize: 12,
  },
  positive: {
    color: colors.green,
  },
  negative: {
    color: colors.red,
  },
});
