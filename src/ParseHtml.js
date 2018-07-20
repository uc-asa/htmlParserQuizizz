
'use strict';
import React from 'react';
import {
	  Text,
    StyleSheet,
    View
} from 'react-native';

export default class ParseHTML extends React.Component {
  constructor(props) {
    super(props)
    let defaultTagToStyle = {
      '<sub>': {lineHeight: 54},
      '<sup>': {lineHeight: 28},
      '<span>': 'span',
      '<br>': 'br'
    };
    if(props.customTagToStyle){
      for(var i in Object.keys(props.customTagToStyle)){
        defaultTagToStyle[Object.keys(props.customTagToStyle)[i]] = props.customTagToStyle[Object.keys(props.customTagToStyle)[i]];
      }
    }
    this.state = {
      tagToStyle: defaultTagToStyle
    }
  }

  _getNextHTMLTag(html_code, tags_to_look_for) {
    var min = -1;
    var nextTag = "";
    for (var i = 0; i < tags_to_look_for.length; i++) {
      var tag = tags_to_look_for[i];
      var nextIndex = html_code.indexOf(tag);
      if(min == -1){
        min = nextIndex;
        nextTag = tag;
      }
      else{
        if(min>nextIndex && nextIndex != -1){
          min = nextIndex;
          nextTag = tag;
        }
      }
    }
    return {"tag": nextTag, "indexStart": min};
  }

  _buildHTMLParseTree(html_code){
    return this._buildHTMLParseTreeOverload(html_code, []);
  }

  _buildHTMLParseTreeOverload(html_code, segments = [], style = []){
    var nextTag = this._getNextHTMLTag(html_code, Object.keys(this.state.tagToStyle));
    if(nextTag.indexStart != -1){
      if(nextTag.indexStart>0){
        segments.push({
                        "text": html_code.slice(0, nextTag.indexStart),
                        "style": style,
                      });
      }
      var endTag = "</"+(nextTag.tag).slice(1);
      var indexEnd = html_code.indexOf(endTag);
      var new_text = html_code.slice(nextTag.indexStart+nextTag.tag.length, indexEnd);
      segments.push({"segments": this._buildHTMLParseTreeOverload(new_text, [], style.concat([this.state.tagToStyle[nextTag.tag]]))});
      return this._buildHTMLParseTreeOverload(html_code.slice(indexEnd+endTag.length, html_code.length), segments);
    }
    else{
      if(html_code!=''){
        segments.push({"text": html_code,
                       "style": style});
      }
      return segments;
    }
  }
  _renderHTMLParseTree(parseTree){
    // console.log(parseTree, 'hi jarvis')
    let s = []
    let s1 = []
    for (let i in parseTree) {
      const data = parseTree[i]
      let str = ''
      let style = {}
      if (data.text) {
        str = data.text
      } else if (typeof data.segments == 'object') {
        const item = data.segments[0]
        str = item.text
        style = item.style
      }
      if (str.indexOf('<br/>') > -1) {
        const arr = str.split("<br/>")
        s.push(
          <Text key={`text_${i}`} style={[styles.textContainer, style]}>{arr[0]}</Text>
        )
        s1.push(
          <View key={`view_${i}`} style={{flexDirection: 'row'}}>{s}</View>
        )
        s = [<Text key={`text_${i}_0`} style={[styles.textContainer, style]}>{arr[1]}</Text>]
      } else {
        s.push(<Text key={`text_${i}`} style={[styles.textContainer, style]}>{str}</Text>)
      }
    }
    s1.push(
      <View key={`view_-1`} style={{flexDirection: 'row'}}>{s}</View>
    )
    return (
      <View>
       {s1}
      </View>
    )
    return parseTree.map((segment)=>{
      if(segment.segments)
        return this._renderHTMLParseTree(segment.segments)
      return <Text key={i++} style={segment.style}>{segment.text}</Text>;
    });
  }

  _decodeHTMLEntities(str){
    return String(str)
      .replace(/<br(>|\s|\/)*/g, '\n');
  }

  render() {
    return this._renderHTMLParseTree(this._buildHTMLParseTree((this.props.code)))
    return (
      <Text style={styles.textContainer}>
        {this._renderHTMLParseTree(this._buildHTMLParseTree(this._decodeHTMLEntities(this.props.code)))}
      </Text>
    );
  }
}

const styles = StyleSheet.create({
  textContainer: {
    color: '#eff',
    fontSize: 28,
    lineHeight: 40
  }
});

module.exports = ParseHTML;
