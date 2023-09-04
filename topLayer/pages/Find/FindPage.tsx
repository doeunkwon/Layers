import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import Find from './Find';
import MarkedList from './MarkedList';
import ForeignProfile from '../../pages/Profile/ForeignProfile';

import { Stack } from '../../utils/StackNavigation';
import { NavigationContainer } from '@react-navigation/native';

import { StackNavigation } from '../../constants/Enums';
import GlobalStyles from '../../constants/GlobalStyles';

import { usersData } from '../../constants/testData';

import ItemViewPage from '../../pages/ItemView/ItemViewPage';
import OutfitViewPage from '../../pages/OutfitView/OutfitViewPage';

const FindPage = () => {

    const FindComponent = () => (<Find usersData={usersData} />)
    const MarkedListComponent = () => (<MarkedList usersData={usersData} />)
    const ForeignProfileComponent = () => (<ForeignProfile isPrivate={false} />)
    const ItemViewPageComponent = () => (<ItemViewPage />)
    const OutfitViewPageComponent = () => (<OutfitViewPage />)

    return (
        <NavigationContainer
            independent={true}>
            <Stack.Navigator>
                <Stack.Group
                    screenOptions={{
                        headerTitleStyle: GlobalStyles.typography.subtitle,
                        headerStyle: {
                            backgroundColor: GlobalStyles.colorPalette.background,
                        },
                        headerShadowVisible: false,
                    }}>
                    <Stack.Screen
                        name={StackNavigation.Find}
                        component={FindComponent}
                        options={{
                            headerShown: false
                        }}
                    />
                    <Stack.Group
                        screenOptions={{
                            presentation: 'modal'
                        }}>
                        <Stack.Screen
                            name={StackNavigation.MarkedList}
                            component={MarkedListComponent}
                            options={{
                                headerTitle: `${usersData.length} Marked`
                            }}
                        />
                        <Stack.Screen
                            name={StackNavigation.ForeignProfile}
                            component={ForeignProfileComponent}
                            options={{
                                headerShown: false,
                            }}
                        />
                        <Stack.Screen
                            name={StackNavigation.ItemView}
                            component={ItemViewPage}
                            options={{
                                headerShown: false,
                            }}
                        />
                        <Stack.Screen
                            name={StackNavigation.OutfitView}
                            component={OutfitViewPage}
                            options={{
                                headerShown: false,
                            }}
                        />
                    </Stack.Group>
                </Stack.Group>
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default FindPage

const styles = StyleSheet.create({})