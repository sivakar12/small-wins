import React from 'react'
import { View, Text, StyleSheet, Modal, SafeAreaView } from 'react-native'

type MenuItem = {
  text: string,
  handler: () => void
}

type MenuProps = {
  open: boolean,
  items: MenuItem[],
  onClose: () => void
}

const Menu = ({ open, items, onClose }: MenuProps) => {
  return (
    <Modal style={styles.menuModal} visible={open} animationType="slide">
      <SafeAreaView>
      <View style={styles.menuList}>
        {/* <View style={styles.closeButton}>
          <Text onPress={onClose} style={styles.closeButtonText}>x</Text>
        </View> */}
        {items.map(item => (
          <View key={item.text} style={styles.menuItemView}>
            <Text onPress={() => {item.handler(); onClose(); } } style={styles.menuItemText}>{item.text}</Text>
          </View>
        ))}
        <View style={styles.menuItemView}>
          <Text onPress={onClose} style={styles.menuItemText}>Cancel</Text>
        </View>
      </View>
      </SafeAreaView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  menuModal: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuList: {
    height: '100%',
    alignItems: 'center',
    // justifyContent: 'flex-end',
    justifyContent: 'center',
  },
  menuItemView: {
    padding: 20,
    alignContent: 'center',
    justifyContent: 'center'
  },
  menuItemText: {
    fontSize: 20,
    textAlign: 'center'
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 10,
    backgroundColor: 'red'
  },
  closeButtonText: {
    fontSize: 20,
    color: 'white',
  }
})

export default Menu