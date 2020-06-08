import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import NumericInput from './NewEvent/NumericInput';

const EditApparelNumber = ({ navigation }) => {
  const [number, setNumber] = useState(0);

  const handleSubmit = async () => {
    const onSubmit = navigation.getParam('onSubmitApparelNumber');
    await onSubmit(number);
    navigation.goBack();
  };

  const handleTextChanged = text => setNumber(text);

  return (
    <View style={styles.View}>
      <NumericInput
        value={0}
        onChange={handleTextChanged}
        onEnter={handleSubmit}
        title="Match.EditApparelNumber.Title"
        subTitle="Match.EditApparelNumber.SubTitle"
        maxLength={3}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  View: {
    flex: 1,
  },
});

export default EditApparelNumber;
