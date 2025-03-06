import { ScrollView, Text, View, StyleSheet, SafeAreaView } from 'react-native';

export default function TermsOfService() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        <View style={styles.content}>
          <Text style={styles.date}>Effective Date: March 6, 2025</Text>

          <Text style={styles.paragraph}>
            Welcome to Streek! These Terms of Service ("Terms") govern your use of the Streek mobile application ("App") and services ("Services"). By accessing or using Streek, you agree to these Terms. If you do not agree, please do not use the App.
          </Text>

          <Text style={styles.heading}>1. Use of the App</Text>
          <Text style={styles.paragraph}>• You must be at least 13 years old to use Streek. If under 18, parental consent is required.</Text>
          <Text style={styles.paragraph}>• You must provide accurate information when creating an account and maintain its security.</Text>
          <Text style={styles.paragraph}>• Streek is for personal use only. Commercial use requires permission.</Text>

          <Text style={styles.heading}>2. Features & Functionality</Text>
          <Text style={styles.paragraph}>• Habit tracking, progress analytics, and streak maintenance.</Text>
          <Text style={styles.paragraph}>• Customization options for habits, reminders, and categories.</Text>
          <Text style={styles.paragraph}>• Social sharing features (if applicable).</Text>

          <Text style={styles.heading}>3. User Conduct</Text>
          <Text style={styles.paragraph}>You agree not to:</Text>
          <Text style={styles.bulletItem}>• Use the app for illegal, fraudulent, or harmful activities.</Text>
          <Text style={styles.bulletItem}>• Hack, reverse engineer, or interfere with Streek.</Text>
          <Text style={styles.bulletItem}>• Provide false information or engage in harassment.</Text>

          <Text style={styles.heading}>4. Subscription & Payments</Text>
          <Text style={styles.paragraph}>• Some features may require a premium subscription.</Text>
          <Text style={styles.paragraph}>• Payments are processed through third-party providers.</Text>
          <Text style={styles.paragraph}>• Subscriptions auto-renew unless canceled.</Text>
          <Text style={styles.paragraph}>• No refunds unless required by law.</Text>

          <Text style={styles.heading}>5. Data & Privacy</Text>
          <Text style={styles.paragraph}>• We collect and use data as explained in our Privacy Policy.</Text>
          <Text style={styles.paragraph}>• Habit-related data is used to improve user experience.</Text>

          <Text style={styles.heading}>6. Intellectual Property</Text>
          <Text style={styles.paragraph}>• Streek content and trademarks are owned by us.</Text>
          <Text style={styles.paragraph}>• You may not copy, modify, or distribute our content without permission.</Text>

          <Text style={styles.heading}>7. Termination & Account Suspension</Text>
          <Text style={styles.paragraph}>• We may suspend or terminate accounts violating these Terms.</Text>
          <Text style={styles.paragraph}>• You can delete your account via the App settings.</Text>

          <Text style={styles.heading}>8. Disclaimer & Limitation of Liability</Text>
          <Text style={styles.paragraph}>• Streek provides habit-tracking tools but does not guarantee results.</Text>
          <Text style={styles.paragraph}>• We are not responsible for data loss or service interruptions.</Text>

          <Text style={styles.heading}>9. Changes to These Terms</Text>
          <Text style={styles.paragraph}>• We may update these Terms. Continued use constitutes acceptance of changes.</Text>

          <Text style={styles.heading}>10. Contact Us</Text>
          <Text style={styles.paragraph}>If you have questions, contact us:</Text>
          <Text style={styles.bulletItem}>• Email: ijon04kushta@gmail.com</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    marginBottom: 8,
    color: '#1B1B3A',
  },
  date: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#1B1B3A',
    marginBottom: 16,
  },
  heading: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    marginTop: 24,
    marginBottom: 12,
    color: '#1B1B3A',
  },
  paragraph: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    lineHeight: 24,
    color: '#1B1B3A',
    marginBottom: 16,
  },
  bulletItem: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    lineHeight: 24,
    color: '#1B1B3A',
    marginBottom: 8,
    paddingLeft: 8,
  },
});