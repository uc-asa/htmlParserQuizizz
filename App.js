/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import ParseHTML from './src/ParseHtml'


export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <ParseHTML code={'This is sample text to test:<br/>Superscript: x<sup>2</sup>+y<sup>2</sup><br/>Subscript: H<sub>2</sub>O'}/>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  textContainer: {
    paddingVertical: 20,
    backgroundColor: '#253d54',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  }
});
