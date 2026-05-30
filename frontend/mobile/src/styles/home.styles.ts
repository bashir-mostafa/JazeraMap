// src/styles/home.styles.ts
import { StyleSheet } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDERS, SHADOWS } from '@/constants/theme';

export const homeStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
  },
  greeting: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  userName: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
    marginTop: SPACING.xs,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: BORDERS.round,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationIcon: {
    fontSize: 20,
  },
  notificationBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.error,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    marginHorizontal: SPACING.xl,
    marginVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderRadius: BORDERS.lg,
    gap: SPACING.sm,
  },
  searchIcon: {
    fontSize: 18,
  },
  searchText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  categoriesSection: {
    marginTop: SPACING.md,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING.md,
  },
  categoriesContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.xl,
    gap: SPACING.sm,
  },
  categoryChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDERS.xl,
    backgroundColor: COLORS.lightGray,
    marginRight: SPACING.sm,
  },
  categoryChipActive: {
    backgroundColor: COLORS.accent,
  },
  categoryText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  categoryTextActive: {
    color: COLORS.background,
  },
  placesSection: {
    marginTop: SPACING.md,
    marginBottom: SPACING.xxl,
  },
  placeCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING.md,
    borderRadius: BORDERS.lg,
    overflow: 'hidden',
    ...SHADOWS.md,
  },
  placeImage: {
    width: 100,
    height: 100,
  },
  placeContent: {
    flex: 1,
    padding: SPACING.md,
  },
  placeName: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  placeRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  ratingText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.warning,
  },
  reviewText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
  },
  placeCategory: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
  },
});