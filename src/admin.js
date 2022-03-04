import 'react-native-gesture-handler';

import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  TextInput,
  SafeAreaView,
} from 'react-native';

const AdminScreen = ({navigation}) => {
  const [code, setCode] = useState(null);

  return (
    <SafeAreaView>
      <View style={styles.mainView}>
        <Text style={styles.baseText}>
          <Text style={styles.TextStyle}>관리자 인증 코드를 입력해주세요</Text>
        </Text>
        <TextInput
          style={styles.TextInput}
          value={code}
          color="#000"
          onChangeText={text => setCode(text)}
          autoCapitalize="none"
          returnKeyType="done"
          secureTextEntry
        />
        <Button
          title="Login"
          color="#A33B39"
          onPress={() => {
            code === '1905admin'
              ? navigation.navigate('QRscan')
              : Alert.alert('잘못된 입력입니다.');
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainView: {
    backgroundColor: '#ffffff',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  baseText: {
    fontFamily: 'Cochin',
  },
  TextStyle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  TextInput: {
    borderWidth: 2,
    backgroundColor: 'white',
    borderColor: '#A33B39',
    borderRadius: 10,
    paddingLeft: 40,
    paddingRight: 40,
    marginBottom: 40,
    marginTop: 40,
    height: 40,
  },
  titleView: {
    paddingTop: '50%',
  },
});

export default AdminScreen;
