import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import PlayerButton from './PlayerButton';
import ImageButton from './ImageButton';

class PlayerList extends Component {
  handlePress = idPlayer => {
    const p = this.props;

    if (p.onPlayerPressed) p.onPlayerPressed(idPlayer);
  };

  render() {
    const p = this.props;
    const players = p.data;

    if (!players) return null;

    return (
      <FlatList
        data={players}
        keyExtractor={pl => pl.id}
        renderItem={elem => (
          <PlayerButton player={elem.item} onPress={() => this.handlePress(elem.item.id)} />
        )}
        numColumns={3}
      />
    );

    // return (
    //     <ScrollView style={style.View}>
    //         {players.map(pl => {
    //             return <PlayerButton key={pl.id} player={pl} />
    //         })}
    //     </ScrollView>
    // )
  }
}

const style = StyleSheet.create({
  View: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
});

export default PlayerList;
