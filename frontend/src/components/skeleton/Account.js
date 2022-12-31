import React from 'react'
import {StyleSheet} from 'react-native'
import {View as MotiView} from 'moti'
import {Skeleton} from 'moti/skeleton'

const Spacer = ({height=16})=><MotiView style={{height}}/>

const AccountSkeleton = () => {

    const colorMode = 'light'

    return (
        <MotiView
            transsition={{type:'timing'}}
            style={[styles.container]}
        >

            <Skeleton colorMode={colorMode} height={'20%'} width={'100%'}/>
            <Spacer />
            <Skeleton colorMode={colorMode} height={'20%'} width={'100%'}/>
            <Spacer />
            <Skeleton colorMode={colorMode} height={'20%'} width={'100%'}/>
            <Spacer />
            <Skeleton colorMode={colorMode} height={'20%'} width={'100%'}/>
            <Spacer />
            
        </MotiView>
    )
}

export default AccountSkeleton


const styles=StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center'
    }
})