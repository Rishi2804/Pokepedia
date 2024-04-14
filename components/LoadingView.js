import { StyleSheet, Text, SafeAreaView, ActivityIndicator } from 'react-native';

const LoadingView = () => {
    return (
    <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large"/>
        <Text>Loading...</Text>
    </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LoadingView;
