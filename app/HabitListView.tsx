import React, { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppContext } from './Context';
import { padding, listItemColors, fontSizes } from './StyleConstants';
import { Habit } from './Types';

type HabitListPropType = { children: React.ReactNode | React.ReactNode[] }
type HabitPropType = { 
    habit: Habit,
    color: string,
    onIncrement: () => void
}

const HabitItem = ({ habit, onIncrement, color }: HabitPropType) => {
    const style = StyleSheet.compose(styles.habitItem, {'backgroundColor': color})
    const navigation = useNavigation()
    const handleOnPress = () => {
        navigation.navigate('HabitDetail', { habitId: habit.id })
    }
    return (
        <View style={style}> 
            <Text style={styles.habitNameText} onPress={handleOnPress}>{habit.name}</Text>
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

const HabitListView = () => {
    const {habits, incrementHabit} = useContext(AppContext);
    return (
        <View style={styles.habitListView}>
            <Text style={styles.title}>Habits Builder</Text>
            <HabitList>
                {habits.map((habit, i) => {
                    const color = listItemColors[i % listItemColors.length]
                    const onIncrementHandler = () => incrementHabit(habit.id)
                    return (
                        <HabitItem 
                            key={habit.id}
                            habit={habit} 
                            onIncrement={onIncrementHandler} 
                            color={color}/>
                    )
                })}
            </HabitList>
        </View>
    ) 
}
const styles = StyleSheet.create({
    habitItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: padding,
        fontSize: fontSizes[1]
    },
    habitList: {
        flex: 1,
    },
    habitLogCount: {
        padding: padding,
        fontSize: fontSizes[1],
        paddingHorizontal: padding,
        fontWeight: 'bold'
    },
    habitIncrementButton: {
        backgroundColor: '#fff0',
        fontSize: fontSizes[1],
        paddingHorizontal: padding
    },
    habitNameText: {
        fontSize: fontSizes[1],
        flexGrow: 1
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