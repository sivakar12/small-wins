import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, ScrollView, Dimensions } from 'react-native'
import dayjs, { Dayjs } from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)
import _ from 'lodash'
import { colorPalette, fontSizes, padding } from './StyleConstants'
import { VictoryChart, VictoryBar, VictoryAxis } from "victory-native"
enum PeriodType {
    Day = "day",
    Week = "week",
    Month = "month",
    Year = "year"
}

type PeriodChooserPropType = {
    periodType: PeriodType,
    onChange: (peroidType: PeriodType) => void
}
const PeriodChooser = ({ periodType: selectedPeriodType, onChange}: PeriodChooserPropType) => {
    return (
        <View style={styles.chooser}>
            {Object.values(PeriodType).map(periodType => {
                const selected = selectedPeriodType == periodType
                const style = selected ? 
                    StyleSheet.compose(styles.chooserValueText, {fontWeight: "bold"}) :
                    styles.chooserValueText
                const onPressHandler = () => { onChange(periodType) }
                return (
                    <Text style={style} key={periodType} onPress={onPressHandler}>
                        {periodType}
                    </Text>
                )
            })}
        </View>
    )
}

type PeriodChangerPropType = {
    periodType: PeriodType,
    startTime: Dayjs,
    endTime: Dayjs,
    onChange: (startTime: Dayjs, endTime: Dayjs) => void
}

const PeriodChanger = ({periodType, startTime, endTime, onChange}: PeriodChangerPropType) => {
    // I am passing peroidType directly into dayjs startOf, endOf, add and subtract
    // functions because the string values under the enum matches what is required
    // by dayjs

    let timeDisplay: string
    switch (periodType) {
        case PeriodType.Day:
            timeDisplay = startTime.local().format('MMMM D, YYYY')
            break;
        case PeriodType.Week:
            timeDisplay = startTime.local().format('MMMM D, YYYY') + ' : ' + endTime.format('MMMM D, YYYY')
            break;
        case PeriodType.Month:
            timeDisplay = startTime.local().format('MMMM YYYY')
            break;
        case PeriodType.Year:
            timeDisplay = startTime.local().format('YYYY')
            break;
    }
    const timeDebugDisplay = startTime.toDate().toString() + ' - ' + endTime.toDate().toString()
    const handlePrevious = () => {
        const newStartTime = startTime.subtract(1, periodType)
        const newEndTime = endTime.subtract(1, periodType)
        onChange(newStartTime, newEndTime)
    }
    const handleNext = () => {
        const newStartTime = startTime.add(1, periodType)
        const newEndTime = endTime.add(1, periodType)
        onChange(newStartTime, newEndTime)
    }
    return (
        <View style={styles.periodChangerRow}>
            <Text style={styles.periodChangerArrow} onPress={handlePrevious}>&lt;&nbsp;</Text>
            <Text style={styles.periodChangerDisplay}>{timeDisplay}</Text>
            <Text style={styles.periodChangerArrow} onPress={handleNext}>&nbsp;&gt;</Text>
        </View>
    )
}

type ChartsPropType = {
    timestampsSortedDown: number[]
}
const Charts = ({timestampsSortedDown}: ChartsPropType) => {
    const [periodType, setPeriodType] = useState(PeriodType.Day)
    const initialStartDate = dayjs().startOf(periodType)
    const initialEndDate = dayjs().endOf(periodType)

    
    const [[filterDateStart, filterDateEnd], setFilterRange] = useState([initialStartDate, initialEndDate])
    useEffect(() => {
        setFilterRange([filterDateEnd.startOf(periodType), filterDateEnd.endOf(periodType)])
    }, [periodType])
    
    const startTimestamp = filterDateStart.toDate().getTime()
    const endTimestamp = filterDateEnd.toDate().getTime()
    
    // TODO: Make a better filter as this is a sorted array
    const filteredTimestamps = timestampsSortedDown.filter(t => 
        t < endTimestamp && t > startTimestamp)
    // const filteredTimestamps = timestampsSortedDown

    let labels: string[] | number[];
    let counts: { [label: string | number]: number } = {};
    switch (periodType) {
        case PeriodType.Day:
            const hours = _.range(0, 24)
            labels = hours
            counts = Object.fromEntries(hours.map(h => [h, 0]))
            filteredTimestamps.forEach(t => {
                const hour = dayjs(t).hour()
                counts[hour] += 1
            })
            break
        case PeriodType.Week:
            labels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
            counts = Object.fromEntries(labels.map(l => [l, 0]))
            filteredTimestamps.forEach(t => {
                const day = labels[dayjs(t).day()]
                counts[day] += 1
            })
            break
        case PeriodType.Month:
            const days = _.range(1, dayjs(startTimestamp).daysInMonth() + 1)
            labels = days
            counts = Object.fromEntries(days.map(d => [d, 0]))
            filteredTimestamps.forEach(t => {
                const date = dayjs(t).date()
                counts[date] += 1
            })
            break
        case PeriodType.Year:
            const months = ['January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December']
            labels = months
            counts = Object.fromEntries(months.map(m => [m, 0]))
            filteredTimestamps.forEach(t => {
                const month = months[dayjs(t).month()]
                counts[month] += 1
            })
            break
    }
    const chartData = labels.map(label => ({
        x: label.toString().substr(0, 3),
        y: counts[label]
    }))

    const chartWidth = Math.max(Dimensions.get('window').width - 40, 600)
    const ChartView = () => 
        <ScrollView horizontal>
            <VictoryChart width={chartWidth} domainPadding={10}>
                <VictoryBar
                    data={chartData}
                    categories={{x: labels.map(s => s.toString().substring(0, 3))}}
                    minDomain={{x: 0}}
                />
                <VictoryAxis/>
            </VictoryChart>
        </ScrollView>

    return (
        <View style={styles.chartContainer}>
            <PeriodChooser 
                periodType={periodType}
                onChange={setPeriodType}
            />
            <PeriodChanger
                periodType={periodType}
                startTime={filterDateStart}
                endTime={filterDateEnd}
                onChange={(s, e) => { setFilterRange([s, e])}}
            />
            <ScrollView horizontal={true}>
                <ChartView/>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    chartContainer: {
        alignContent: 'center',
        backgroundColor: colorPalette[4]
    },
    chooser: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    chooserValueText: {
        fontSize: fontSizes[1],
        padding: padding
    },
    periodChangerRow: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    periodChangerArrow: {
        fontSize: fontSizes[1]
    },
    periodChangerDisplay: {
        fontSize: fontSizes[1],
    }
})

export { Charts as default }