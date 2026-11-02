import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';
import { getWatchlist } from '../services/marketApi';
import { Stock } from '../types';

export default function WatchlistScreen() {
  const [stocks, setStocks] = useState<Stock[]>([]);

  useEffect(() => {
    const load = async () => {
      setStocks(await getWatchlist());
    };

    load();
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      <Text style={styles.title}>Watchlist</Text>
      {stocks.map((stock) => (
        <View key={stock.symbol} style={styles.row}>
          <View>
            <Text style={styles.symbol}>{stock.symbol}</Text>
            <Text style={styles.name}>{stock.name}</Text>
          </View>

          <View style={styles.rightBlock}>
            <Text style={styles.price}>₹{stock.price.toLocaleString()}</Text>
            <Text style={[styles.delta, stock.changePercent >= 0 ? styles.positive : styles.negative]}>
              {stock.changePercent >= 0 ? '+' : ''}
              {stock.changePercent.toFixed(2)}%
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  symbol: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  name: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 4,
  },
  rightBlock: {
    alignItems: 'flex-end',
  },
  price: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  delta: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  positive: {
    color: colors.green,
  },
  negative: {
    color: colors.red,
  },
});
