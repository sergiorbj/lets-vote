import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { useFeatures } from '../hooks/useFeatures';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { colors } from '../constants/colors';
import { Feature } from '../types';

type RankingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Ranking'>;

export const RankingScreen: React.FC = () => {
  const navigation = useNavigation<RankingScreenNavigationProp>();
  const { features, loading } = useFeatures();

  const getMedal = (index: number): string => {
    switch (index) {
      case 0:
        return '🥇';
      case 1:
        return '🥈';
      case 2:
        return '🥉';
      default:
        return '';
    }
  };

  const renderFeature = ({ item, index }: { item: Feature; index: number }) => {
    const isTopThree = index < 3;

    return (
      <Card style={[styles.featureCard, ...(isTopThree ? [styles.topThree] : [])]}>
        <View style={styles.featureHeader}>
          <Text style={styles.rank}>
            {getMedal(index) || `#${index + 1}`}
          </Text>
          <View style={styles.featureTitleContainer}>
            <Text style={styles.featureTitle}>{item.title}</Text>
          </View>
        </View>
        <Text style={styles.voteCount}>{item.voteCount} votes</Text>
        <Text style={styles.description}>{item.description}</Text>
      </Card>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Feature Rankings</Text>
      </View>

      <FlatList
        data={features}
        keyExtractor={(item) => item.id}
        renderItem={renderFeature}
        contentContainerStyle={styles.listContent}
      />

      <View style={styles.footer}>
        <Button onPress={() => navigation.navigate('Vote')} fullWidth testID="back-to-voting-button">
          Back to Voting
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.gray[50],
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.gray[900],
  },
  listContent: {
    padding: 20,
    paddingTop: 0,
  },
  featureCard: {
    marginBottom: 16,
  },
  topThree: {
    borderWidth: 2,
    borderColor: colors.primary[200],
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rank: {
    fontSize: 24,
    marginRight: 12,
  },
  featureTitleContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray[900],
  },
  voteCount: {
    fontSize: 14,
    color: colors.primary[600],
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: colors.gray[600],
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
  },
});
