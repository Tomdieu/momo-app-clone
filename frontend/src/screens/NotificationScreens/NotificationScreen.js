import { StyleSheet, Text, View, SafeAreaView, NativeModules, RefreshControl, ActivityIndicator, FlatList, TouchableOpacity, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'

// import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { COLORS } from '../../utils/constants'
import { AntDesign } from '@expo/vector-icons';

import { FAB } from 'react-native-paper'

import ApiService from "../../utils/ApiService"

import Notification from '../../components/Notification'

import { useAuthContext } from '../../context/AuthContext'

import moment from 'moment'


const { StatusBarManager } = NativeModules

moment.locale('en')

const NotificationScreen = ({ navigation }) => {

  const [selectedNotification, setSelectedNotification] = useState([])

  const [messages, setMessages] = useState([])

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

 

  const { token } = useAuthContext();

  useEffect(() => {
    ApiService
      .getNotifications(token)
      .then(res => res.json())
      .then(data => {
        setMessages(data.data)
        setLoading(false);
      })
      .catch(err => {
        console.log(err)
        setLoading(false);
      })
  }, []);

  const onRefresh = React.useCallback(()=>{
    setRefreshing(true);
    ApiService
      .getNotifications(token)
      .then(res => res.json())
      .then(data => {
        setMessages(data.data)
        setLoading(false);
        setRefreshing(false)
      })
      .catch(err => {
        console.log(err)
        setLoading(false);
        setRefreshing(false)
      })
  });

  const selectNotification = (notification) => {
    console.log(notification)
    if (selectedNotification?.includes(notification.id)) {
      const newList = selectedNotification.filter(notificationId => notification.id !== notificationId)
      return setSelectedNotification(newList)
    }
    setSelectedNotification([...selectedNotification, notification.id])
  }


  const openNotification = (notification) => {
    if (selectedNotification?.length) {
      return selectNotification(notification)
    }
    navigation.navigate('NotificationDetail', { notification })
  }

  const getSelected = (notification) => {
    return selectedNotification?.includes(notification.id)
  }

  const unselecteAllNotifications = () => {
    setSelectedNotification([])
  }

  const deleteMultipleNotifications = () => {
    if (!selectedNotification?.length) return;
    Alert.alert(
      'Delete Notifications',
      'Are you sure you want to delete the selected notifications?',
      [
        {
          text: 'No',
          onPress: () => {
            unselecteAllNotifications();
          },
        },
        {
          text: 'Yes',
          onPress: () => {
            selectedNotification?.map((id) => {

              ApiService.deleteNotifications(id, token).then(() => {
                console.log('Deleted ')

                const filteredNotifications = messages.filter((msg)=>msg.id !== id);
  
                setMessages(filteredNotifications);
  
                // const unDeleted = selectedNotification.filter((notId)=>id!==notId);
                // setSelectedNotification(unDeleted);
  
              }).catch((error) => console.log(error))

            })
            setSelectedNotification([]);


          }
        }
      ]);
  }

  const isEmpty = () => selectedNotification?.length === 0

  if (loading) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.bg }}>
      <ActivityIndicator size={'large'} color={COLORS.blue} />
    </View>
  }

  const NoMessage = () => {
    return <View style={{ paddingVertical: 20, alignSelf: 'center',width:'100%',alignItems:'center',justifyContent:'center' }}>
      <Text style={{ fontSize: 20,fontWeight:'700',borderWidth:1,padding:20,width:'80%',borderRadius:3 }}>No Notifications</Text>
    </View>
  }

  return (
    <SafeAreaView style={{
      ...styles.container,
      paddingTop: Platform.OS == "android" ? StatusBarManager.HEIGHT : 0,
    }}
    >
      <View style={{ flex: 1, marginTop: 10, paddingHorizontal: 8 }}>
        <Text style={{ fontSize: 25, fontWeight: '800', marginVertical: 8 }}>Notifications</Text>
        {messages.length == 0 && <NoMessage />}
        <FlatList
          data={messages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <Notification item={item} selected={getSelected(item)} onLongPress={selectNotification} onPress={openNotification} />
          )}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
        {!isEmpty() && <FAB icon={'delete'} onPress={deleteMultipleNotifications} style={{ ...styles.fab, backgroundColor: COLORS.orange }} />}

      </View>
    </SafeAreaView>
  )
}

export default NotificationScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg
  },
  notification: {
    // flexDirection: 'row',
    padding: 6,
    paddingVertical: 12,
    marginVertical: 8,
    backgroundColor: COLORS.white,
    justifyContent: 'space-between',
    // alignItems: 'center',
    marginHorizontal: 5,
    borderRadius: 5,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  overlay: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,.5)',
    top: 0,
    left: 0
  }
})