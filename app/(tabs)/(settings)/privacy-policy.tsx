import { ScrollView, Text, View, StyleSheet, SafeAreaView } from 'react-native';

export default function PrivacyPolicy() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        <View style={styles.content}>
          <Text style={styles.date}>Effective Date: March 6, 2025</Text>

          <Text style={styles.paragraph}>
            Welcome to Streek! Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information when you use the Streek mobile application ("App").
          </Text>

          <Text style={styles.heading}>1. Information We Collect</Text>
          <Text style={styles.paragraph}>We may collect the following types of information:</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Personal Information: Name, email address (if provided).</Text>
            <Text style={styles.bulletItem}>• Habit Data: Your tracked habits and progress.</Text>
            <Text style={styles.bulletItem}>• Device & Usage Data: App interactions, analytics, and crash reports.</Text>
          </View>

          <Text style={styles.heading}>2. How We Use Your Information</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• To provide and improve habit-tracking features.</Text>
            <Text style={styles.bulletItem}>• To analyze usage patterns for better user experience.</Text>
            <Text style={styles.bulletItem}>• To send notifications and reminders (if enabled).</Text>
          </View>

          <Text style={styles.heading}>3. Data Security</Text>
          <Text style={styles.paragraph}>
            We take reasonable measures to protect your data. However, no method of transmission over the internet is 100% secure.
          </Text>

          <Text style={styles.heading}>4. Third-Party Services</Text>
          <Text style={styles.paragraph}>
            Streek may use third-party analytics and payment providers. These services have their own privacy policies.
          </Text>

          <Text style={styles.heading}>5. Data Retention</Text>
          <Text style={styles.paragraph}>
            We retain user data as long as necessary for service functionality. You can request data deletion by contacting us.
          </Text>

          <Text style={styles.heading}>6. Your Rights</Text>
          <Text style={styles.paragraph}>
            You may request access, correction, or deletion of your personal data by contacting us at the email below.
          </Text>

          <Text style={styles.heading}>7. Updates to This Policy</Text>
          <Text style={styles.paragraph}>
            We may update this Privacy Policy from time to time. Continued use of Streek means you accept any changes.
          </Text>

          <Text style={styles.heading}>8. Contact Us</Text>
          <Text style={styles.paragraph}>If you have any questions about this Privacy Policy, contact us:</Text>
          <Text style={styles.bulletItem}>• By email: ijon04kushta@gmail.com</Text>
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
  bulletList: {
    marginLeft: 8,
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
