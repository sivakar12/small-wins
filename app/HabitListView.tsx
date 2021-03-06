import { property } from 'lodash';
import React, { useContext } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

import { AppContext } from './State';
import { padding, fontSizes } from './StyleConstants';
import { Habit } from './Types';
import { colorPalette } from './StyleConstants';

type HabitListPropType = { 
    children: React.ReactNode | React.ReactNode[],
}

type HabitPropType = { 
    habit: Habit,
    onIncrement: () => void,
    onSelect: () => void,
    index: number
}

const HabitItem = ({ habit, onIncrement, onSelect, index }: HabitPropType) => {
    const color = index % 2 == 0 ? colorPalette[2] : colorPalette[4]
    const habitNameDisplay = habit.archived ? `${habit.name} (archived)` : habit.name
    return (
        <View style={StyleSheet.compose(styles.habitItem, {backgroundColor: color})}> 
            <TouchableOpacity onPress={onSelect} style={styles.habitNameContainer}>
                <Text style={styles.habitNameText}>{habitNameDisplay}</Text>
            </TouchableOpacity>
            <Text style={styles.habitLogCount}>{habit.logs.length}</Text>
            <TouchableOpacity onPress={onIncrement}>
                <Text style={styles.habitIncrementButton}>+</Text>
            </TouchableOpacity>
        </View>
    )
}

const HabitList = ({ children }: HabitListPropType) => {
    return (
        <View style={styles.habitList}>
            {children}
        </View>
    )
}

type  HabitListViewPropType = {
    onHabitSelect: (habitId: string) => void,
    showArchives: boolean
}
const HabitListView = (props: HabitListViewPropType) => {
    const {state: habits, dispatch} = useContext(AppContext);
    const habitsToDisplay = props.showArchives ? 
        habits : habits.filter(habit => !habit.archived)
    return (
        <ScrollView style={styles.habitListView}>
            <HabitList>
                {habitsToDisplay.map((habit, index) => {
                    const onIncrementHandler = () => {
                        dispatch({type: 'INCREMENT_HABIT', habitId: habit.id})
                        if (Platform.OS === 'android' || Platform.OS === 'ios') {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
                        }
                    }
                    return (
                        <HabitItem 
                            key={habit.id}
                            habit={habit} 
                            onIncrement={onIncrementHandler}
                            onSelect={() => {props.onHabitSelect(habit.id)}}
                            index={index}
                            />
                    )
                })}
            </HabitList>
        </ScrollView>
    ) 
}
const styles = StyleSheet.create({
    habitItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: padding,
        fontSize: fontSizes[1],
    },
    habitList: {
        flex: 1,
    },
    habitLogCount: {
        padding: padding,
        fontFamily: 'PatuaOne_400Regular',
        fontSize: fontSizes[1],
        paddingHorizontal: padding,
        fontWeight: 'bold',
        color: 'white'
    },
    habitIncrementButton: {
        backgroundColor: '#fff0',
        fontSize: fontSizes[1],
        fontFamily: 'PatuaOne_400Regular',
        paddingHorizontal: padding,
        color: 'white'
    },
    habitNameContainer: {
        flexGrow: 1,
    },
    habitNameText: {
        fontFamily: 'PatuaOne_400Regular',
        fontSize: fontSizes[1],
        color: 'white'
    },
    habitListView: {
        flex: 1
    },
    title: {
        fontSize: fontSizes[0],
        alignSelf: 'center'
    }
})

export { HabitListView as default }