import { StyleSheet, Text, View,TouchableOpacity } from 'react-native'
import React from 'react'
import { COLORS } from '../utils/constants'
import { AntDesign } from '@expo/vector-icons';
import moment from 'moment'

const Notification = ({ item, selected, onLongPress, onPress }) => {
    return (
        <TouchableOpacity onPress={()=>onPress(item)} onLongPress={()=>onLongPress(item)} style={{ width: '100%',marginVertical:5 }}>
            <View style={styles.notification}>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 ,padding:8}}>
                    {/*<MaterialIcons name={'notifications-none'} size={32} color={COLORS.black} />*/}
                    <AntDesign name="infocirlce" size={32} color={COLORS.black} />
                    <Text style={{ paddingLeft: 5 }} numberOfLines={2} lineBreakMode='tail'>{item.message}</Text>
                </View>
                <View>
                    <Text style={{ textAlign: 'right' }}> {'\t'}  {moment(item.created_at).format('DD MMM')}</Text>
                </View>
            </View>
            {selected && <View style={styles.overlay}></View>}

        </TouchableOpacity>
    )
}

export default Notification

const styles = StyleSheet.create({
    notification: {
        flexDirection: 'row',
        padding: 6,
        paddingVertical: 12,
        marginVertical: 8,
        backgroundColor: COLORS.white,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 5,
        borderRadius: 5,
        position:'relative',
        overflow:'hidden',

    },
    overlay: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        backgroundColor: 'rgba(0,0,0,.3)',
        top: 0,
        left: 0,
        borderRadius:5,
        marginTop:3,
        marginBottom:3,
        padding:5
        
    }
})