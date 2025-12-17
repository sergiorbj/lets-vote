import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { useAuth } from '../hooks/useAuth';
import { useFeatures } from '../hooks/useFeatures';
import { useVotes } from '../hooks/useVotes';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Dropdown } from '../components/ui/Dropdown';
import { colors } from '../constants/colors';
import { ApiError } from '../services/api';

type VoteScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Vote'>;

export const VoteScreen: React.FC = () => {
  const navigation = useNavigation<VoteScreenNavigationProp>();
  const { user, userEmail, logout } = useAuth();
  const { features, loading: featuresLoading } = useFeatures();
  const { votes, submitVote, refetch: refetchVotes } = useVotes();

  const [selectedFeature, setSelectedFeature] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [hasVotedInSession, setHasVotedInSession] = useState(false);

  useEffect(() => {
    if (user && votes.length > 0) {
      const userVote = votes.find((vote) => vote.userId === user.id);
      if (userVote) {
        setSelectedFeature(userVote.featureId);
      }
    }
  }, [user, votes]);

  const handleSubmit = async () => {
    if (!userEmail || !selectedFeature) {
      setError('Please select a feature');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await submitVote(selectedFeature, userEmail);
      await refetchVotes();
      setHasVotedInSession(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to submit vote');
    } finally {
      setSubmitting(false);
    }
  };

  if (featuresLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome, {user?.name}</Text>
        <Button variant="secondary" onPress={logout} testID="logout-button">
          Logout
        </Button>
      </View>

      {hasVotedInSession ? (
        <View style={styles.successContainer}>
          <View style={styles.successIconContainer}>
            <Text style={styles.successIcon}>✓</Text>
          </View>
          <Text style={styles.successTitle}>Thank you for voting!</Text>
          <Text style={styles.successText}>
            Your vote for{' '}
            <Text style={styles.bold}>
              {features.find((f) => f.id === selectedFeature)?.title}
            </Text>
            {' '}has been recorded.
          </Text>
          <Button onPress={() => navigation.navigate('Ranking')} fullWidth testID="view-rankings-button">
            View Rankings
          </Button>
        </View>
      ) : (
        <ScrollView>
          <Text style={styles.pageTitle}>Vote for a Feature</Text>
          <Text style={styles.pageSubtitle}>
            Help us prioritize features for our <Text style={styles.bold}>AI Studies Manager</Text> product.
          </Text>
          <Text style={styles.pageDescription}>
            Select the feature you'd most like to see implemented. You can change your vote at any time.
          </Text>

          <Card>
            <Text style={styles.label}>Select a feature:</Text>
            <Dropdown
              value={selectedFeature}
              onChange={(value) => {
                setSelectedFeature(value);
                setError('');
              }}
              options={features.map((f) => ({ label: f.title, value: f.id }))}
              placeholder="-- Choose a feature --"
              disabled={submitting}
              testID="feature-select"
            />

            {selectedFeature ? (
              <View style={styles.descriptionBox}>
                <Text style={styles.descriptionTitle}>
                  {features.find((f) => f.id === selectedFeature)?.title}
                </Text>
                <Text style={styles.descriptionText}>
                  {features.find((f) => f.id === selectedFeature)?.description}
                </Text>
              </View>
            ) : null}

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Button
              onPress={handleSubmit}
              disabled={!selectedFeature || submitting}
              fullWidth
              testID="submit-vote-button"
            >
              {submitting ? 'Submitting...' : 'Submit Vote'}
            </Button>
          </Card>
        </ScrollView>
      )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray[900],
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.gray[900],
    marginHorizontal: 20,
    marginBottom: 8,
  },
  pageSubtitle: {
    fontSize: 16,
    color: colors.gray[600],
    marginHorizontal: 20,
    marginBottom: 8,
  },
  pageDescription: {
    fontSize: 14,
    color: colors.gray[600],
    marginHorizontal: 20,
    marginBottom: 24,
  },
  bold: {
    fontWeight: '600',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray[700],
    marginBottom: 8,
  },
  descriptionBox: {
    marginTop: 16,
    padding: 12,
    backgroundColor: colors.gray[50],
    borderRadius: 8,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 14,
    color: colors.gray[600],
  },
  error: {
    color: colors.error[700],
    fontSize: 14,
    marginTop: 12,
    marginBottom: 8,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  successIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.success[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  successIcon: {
    fontSize: 32,
    color: colors.success[600],
    fontWeight: 'bold',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: 8,
  },
  successText: {
    fontSize: 16,
    color: colors.gray[600],
    textAlign: 'center',
    marginBottom: 32,
  },
});
