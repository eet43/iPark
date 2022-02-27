/* eslint-disable react-native/no-inline-styles */
import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
//import {baseProps} from 'react-native-gesture-handler/lib/typescript/handlers/gestureHandlers';
import { GoogleSignin } from '@react-native-community/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Chart from './chart';
import ProgressCircle from 'react-native-progress-circle';

const HomeScreen = ({ route, navigation }) => {
  const API_URL = 'https://cxz3619.pythonanywhere.com/liveData/';

  //const userInfo = route.params; //개인정보
  const [users, setUsers] = useState([]); //현재 몇명있는지 정보
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users_member, setUsers_member] = useState([]);
  const [Email, setEmail] = useState(null);
  const [userPhoto, setUserPhoto] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  let email_modify;

  AsyncStorage.getItem('Email').then(Email => {
    setEmail(Email);
  });
  AsyncStorage.getItem('Photo').then(Photo => {
    setUserPhoto(Photo);
  });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetch(API_URL)
      .then(response => response.json())
      .then(data => {
        setUsers(data);
        setRefreshing(false);
      });
  }, []);

  useEffect(() => {
    try {
      fetch(API_URL)
        .then(response => response.json())
        .then(data => {
          setUsers(data);
          setLoading(false);
          AsyncStorage.setItem('isLogin', 'true');
          //AsyncStorage.setItem('isLogin', 'false');
        });
    } catch (e) {
      setError(e);
      throw e;
    }

    AsyncStorage.getItem('Email').then(Email => {
      try {
        console.log(Email);
        if (Email.indexOf('korea.ac.kr') != -1) {
          email_modify = Email.replace('.ac.kr', '');
        }
        if (Email.indexOf('.com') != -1) {
          email_modify = Email.replace('.com', '');
        }
        console.log('change email : ', email_modify);
        console.log(
          'https://cxz3619.pythonanywhere.com/memberData/' + email_modify,
        );

        fetch('https://cxz3619.pythonanywhere.com/memberData/' + email_modify)
          .then(response => response.json())
          .then(data => {
            setUsers_member(data);
            console.log(data);
            console.log(users_member);
          })
          .catch(error => console.log('error : ', error));
      } catch (e) {
        setError(e);
        console.log('error 2 : ', error);
        throw e;
      }
  });
  }, [error]);

  async function signOut() {
    //로그아웃
    try {
      AsyncStorage.setItem('isLogin', 'false');
      navigation.reset({ routes: [{ name: 'Login' }] });
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    } catch (e) {
      Alert.alert('Something else went wrong... ', e.toString());
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator />
      </SafeAreaView>
    );
    //REST API
  } else {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <ScrollView
          contentContainerStyle={styles.mainContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <View style={{ flexDirection: 'row', position: 'relative', flex: 1 }}>
            <View style={styles.container}>
              <View style={styles.radiusbar}>
                <Text style={{ color: 'white' }}>실시간 이용자</Text>
              </View>

              <ProgressCircle
                percent={(users.length / 50) * 100}
                radius={50}
                borderWidth={8}
                color="#A33B39"
                shadowColor="#999"
                bgColor="#fff"
                >
                <Text style={{ fontSize: 18 }}>{users.length} /50</Text>
              </ProgressCircle>
            </View>

            <View style={styles.container}>
              <View style={styles.radiusbar}>
                <Text style={{ color: 'white' }}>유저 프로필</Text>
              </View>
              <Image
                style={{ width: 100, height: 100, borderRadius: 10}}
                source={{ uri: users_member.image }}
                // source={require('./assets/images/checked.png')}
              />
            </View>
          </View>

          <View style={{ flex: 1 }}>
            <View style={styles.container}>
              <View style={styles.radiusbar}>
                <Text style={{ color: 'white' }}>이용시간 분포</Text>
              </View>
              <Chart />
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.button}
              onPress={() =>
                //navigation.reset({routes: [{name: 'QRGenerate'}]})
                navigation.navigate('QRGenerate', {
                  email: Email,
                  photo: userPhoto,
                  name: users_member.name,
                  image: users_member.image,
                  major: users_member.major,
                  student_num: users_member.student_num,
                })
              }>
              <Text style={styles.text}>QR Code</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.button}
              onPress={() =>
                signOut() ? Alert.alert('Logout success') : Alert.alert('error')
              }>
              <Text style={styles.text}>Logout</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.button}
              color="black"
              title="notice"
              onPress={() => navigation.navigate('NoticeBoard')}>
              <Text style={styles.text}>아이파크 공지</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer} />
        </ScrollView>
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    position: 'relative',
  },
  button: {
    width: 100,
    height: 40,
    backgroundColor: '#A33B39',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    marginHorizontal: 5,
  },
  text: {
    color: 'white',
  },
  radiusbar: {
    width: 120,
    height: 30,
    backgroundColor: '#A33B39',
    borderBottomWidth: 0.5,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
    marginBottom: 15,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // padding: StatusBar.currentHeight,
    paddingTop: 5,
    //height: 1000,
  },
  buttonContainer: {
    flex: 0.3,
    flexDirection: 'row',
    marginTop: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loading: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
  },
  footer: {
    height: 55,
    backgroundColor: '#A33B39',
    // marginTop: 20,
  },
});

export default HomeScreen;
