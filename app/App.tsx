import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, Platform, Modal, StatusBar, Alert, Text, useColorScheme, BackHandler } from 'react-native';
import AppLoading from 'expo-app-loading';
import { useFonts, PatuaOne_400Regular } from '@expo-google-fonts/patua-one';
import { useFonts as useFonts2, PassionOne_400Regular } from '@expo-google-fonts/passion-one';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import styled,{createGlobalStyle, ThemeProvider} from 'styled-components/native';

import HabitListView from './HabitListView';
import HabitDetailView from './HabitDetailView';
import HeaderBar from './HeaderBar';
import { useHabitsReducer, AppContext } from './State';
import Menu from './Menu';
import { colorPalette, colorPaletteDark, fontSizes, padding } from './StyleConstants';
import { DeleteConfirmationDialog, NewHabitDialog, RenameHabitDialog } from './DialogBoxes';
import SampleData from './SampleData';
import { Id } from './Types';
import About from './About';

const SafeAreaViewStyled = styled.SafeAreaView`
  flex: 1;
  paddingTop: ${() => Platform.OS === 'android' ? StatusBar.currentHeight : 0};
  backgroundColor: ${props => props.theme.colorPalette['background']}
`

const ModalStyled = styled.Modal`
  height: 100%;
  alignItems: center;
  justifyContent: center;
`
export default function App() {

  const [selectedHabit, setSelectedHabit] = useState<string | null>(null)
  const [showArchives, setShowArchives] = useState(false)
  const [DialogBoxToShow, setDialogBoxToShow] = useState<React.FunctionComponent | null>(null)

  const [ModalToShow, setModalToShow] = useState<React.FunctionComponent | null>(null)

  const [habits, dispatch] = useHabitsReducer()

  const getHabitById = (id: Id) => habits.filter(habit => habit.id === id)[0]


  const mainMenuItems = [
    {
      text: 'New Habit',
      handler: () => {
        if (Platform.OS === 'web') {
          const habitName = prompt('Enter name of new habit')
          if (habitName) {
            dispatch({ type: 'ADD_HABIT', habitName })
          }
        } else if (Platform.OS === 'ios' || Platform.OS == 'android') {
          const handleSubmit = (habitName: string) => {
            if (habitName.length > 0) {
              dispatch({ type: 'ADD_HABIT', habitName })
            }
            setDialogBoxToShow(null)
          }
          const DialogBox = () =>
            <NewHabitDialog onSubmit={handleSubmit} onDismiss={() => setDialogBoxToShow(null)} />
          setDialogBoxToShow(DialogBox)
        }
        return Promise.resolve()
      }
    },
    {
      text: 'Export data',
      handler: () => {
        const timeString = new Date().toISOString();
        const fileUri = FileSystem.cacheDirectory + 'habitsbuilderdata-' + timeString + '.json';
        return FileSystem.writeAsStringAsync(
              fileUri, JSON.stringify(habits, null, 2))
          .then(Sharing.isAvailableAsync)
          .then(isAvailable => {
            if (isAvailable) {
              return Sharing.shareAsync(fileUri);
            }
          })
          .catch(error => { Alert.alert(error.message); })
      }
    },
    {
      text: 'Import data',
      handler: () => {
        return DocumentPicker.getDocumentAsync()
          .then(result => {
            if (result.type == 'success') {
              // read file and parse JSON
              FileSystem.readAsStringAsync(result.uri)
              .then(fileContents => {
                const readHabits = JSON.parse(fileContents);
                dispatch({ type: 'SET_HABITS', habits: readHabits })
                Alert.alert('Habit data imported form file');
              })
            } else if (result.type == 'cancel') {
              // Alert.alert('Import cancelled');
            }
          })
          .catch(error => { console.log(error.message); Alert.alert(error.message); })
      }
    },
    {
      text: 'Load sample data',
      handler: () => {
        dispatch({ type: 'SET_HABITS', habits: SampleData })
        return Promise.resolve()
      }
    },
    {
      text: (showArchives ? 'Hide' : 'Show') + ' archived habits',
      handler: () => {
        setShowArchives(showArchives => !showArchives)
        return Promise.resolve()
      }
    },
    {
      text: 'About',
      handler: () => {
        return new Promise((resolve, reject) => {
          const DialogBox = () =>
            <About onClose={() => { setModalToShow(null); resolve(null); }} />
          setModalToShow(DialogBox)
        })
      }
    }
  ]

  const habitDetailMenuItems =  selectedHabit ? [
    {
      text: 'Delete Last Entry',
      handler: () => {
        dispatch({ type: 'DELETE_LAST_ENTRY', habitId: selectedHabit })
        return Promise.resolve()
      }
    },
    {
      text: 'Rename',
      handler: () => {

        const oldName = getHabitById(selectedHabit)['name'];
        const renameHandler = (newName: string) => {
          if (newName.length > 0) {
            dispatch({ type: 'RENAME_HABIT', habitId: selectedHabit, newName })
          }
          setDialogBoxToShow(null)
        }
        const DialogBox = () =>
            <RenameHabitDialog oldName={oldName} onSubmit={renameHandler} onDismiss={() => setDialogBoxToShow(null)} />
        setDialogBoxToShow(DialogBox)
        return Promise.resolve()
      }
    },
    {
      text: getHabitById(selectedHabit).archived ? 'Unarchive':  'Archive',
      handler: () => {
        dispatch({ type: 'TOGGLE_ARCHIVE', habitId: selectedHabit });
        return Promise.resolve()
      }
    },
    {
      text: 'Delete',
      handler: () => {
        const deleteHandler = () => {
          dispatch({ type: 'DELETE_HABIT', habitId: selectedHabit })
          setDialogBoxToShow(null)
          setSelectedHabit(null)
        }
        const DialogBox = () => <DeleteConfirmationDialog onSubmit={deleteHandler} onDismiss={() => setDialogBoxToShow(null)} />
        setDialogBoxToShow(DialogBox)
        return Promise.resolve()
      }
    }
  ]: [];

  // handle back button on Android
  useEffect(() => {
    const backAction = () => {
      if (selectedHabit) {
        setSelectedHabit(null)
        return true
      }
      return false
    }
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    )
    return () => backHandler.remove()
  }, [selectedHabit])

  const colorScheme = useColorScheme()
  let [fontsLoaded] = useFonts({PatuaOne_400Regular})
  let [fontsLoaded2] = useFonts2({PassionOne_400Regular})
  if (!(fontsLoaded && fontsLoaded2)) {
    return <AppLoading/>
  }

  const handleMenuOpen = () => {
    const items = selectedHabit ? habitDetailMenuItems : mainMenuItems
    const MenuComponent = () => <Menu items={items} onClose={() => setModalToShow(null)} />
    setModalToShow(MenuComponent)
  }

  const theme = {
    fontSizes,
    padding,
    colorPalette: colorScheme == 'dark' ? colorPaletteDark : colorPalette
  }
  return (
    <AppContext.Provider value={{state: habits, dispatch}}>
      <ThemeProvider theme={theme}>
        <SafeAreaViewStyled>
          <HeaderBar 
            title="Small Wins"
            showBack={selectedHabit !== null}
            handleBack={() => setSelectedHabit(null)}
            handleMenu={handleMenuOpen}
            />
          { 
            (selectedHabit) ? 
            <HabitDetailView habitId={selectedHabit}/> : 
            <HabitListView onHabitSelect={setSelectedHabit} showArchives={showArchives}/> 
          }
          <ModalStyled visible={ModalToShow != null} animationType='slide'>
              {ModalToShow}
          </ModalStyled>
          {DialogBoxToShow}
        </SafeAreaViewStyled>
      </ThemeProvider>
    </AppContext.Provider>
  );
}
