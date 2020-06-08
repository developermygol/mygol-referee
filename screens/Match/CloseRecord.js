import React, { Component } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, ScrollView } from 'react-native';
import t from 'tcomb-form-native';
import GlobalStyles from '../../GlobalStyles';
import Loc, { Localize } from '../../components/locale/Loc';
import { inject, observer } from 'mobx-react/native';
import { observable, action, decorate } from 'mobx';
import { toast } from '../../components/Utils';
import SpinnerButton from '../../components/common/SpinnerButton';

var { Form } = t.form;


class CloseRecord extends Component {

    static navigationOptions = {
        title: Localize('Match.Record'),
    }


    Form = t.struct({
        comments: t.maybe(t.String),
    });

    componentDidMount = () => {
        const input = this.form.getComponent('comments').refs.input;
        input.focus();
    }

    adaptStoreToForm = () => {
        const match = this.props.store.matches.current;

        return { ...match }
    }

    adaptFormToStore = () => {
        const match = this.props.store.matches.current;
        const form = this.form.getData();

        match.comments = form.comments;
    }

    data = this.adaptStoreToForm();

    saveButtonHandler = async () => {
        const formData = this.form.getValue();
        if (!formData) {
            toast.error(Localize('Error.ValidationFailed'));
            return;
        }

        const data = { ...formData };  // FormData is a struct, cannot add new fields...

        const store = this.props.store.matches;
        data.idMatch = store.current.id;
        const result = await store.saveRecordClose(data);

        if (result && result.match) this.props.navigation.goBack();
    }

    getForm = () => {
        return this.Form;
    }

    getFormOptions = () => {
        const editable = true;

        return {
            fields: {
                comments: {
                    label: Localize('Match.Comments'), error: Localize('Match.Comments.Validation'), placeholder: Localize('Match.Comments.PlaceHolder'), editable,
                    multiline: true,
                    stylesheet: {
                        ...Form.stylesheet,
                        formGroup: {
                            
                        },
                        textboxView: {
                            height: 150
                        },
                        textbox: {
                            ...Form.stylesheet.textbox,
                            normal: {
                                ...Form.stylesheet.textbox.normal,
                                height: null,
                                textAlignVertical: 'top',
                            },
                            error: {
                                ...Form.stylesheet.textbox.error,
                                height: null,
                            },
                        },
                    },
                },
            }
        };
    }

    render() {
        const p = this.props;
        const store = p.store.matches;

        // If match is "closed" (acta cerrada), read only view with the match minutes. 
        // if it is "finished" but not closed, the show checkboxes to accept it close
        return (
            <KeyboardAvoidingView behavior='padding' style={style.View}>
                <ScrollView style={GlobalStyles.ScrollView} contentContainerStyle={style.ScrollContainer}>
                    <View style={style.FormWrapper}>
                        <Text style={style.Intro}><Loc>Match.Comments.Intro</Loc></Text>
                        <Form
                            ref={c => this.form = c}
                            type={this.getForm()}
                            options={this.getFormOptions()}
                            value={this.data}
                            onChange={(raw) => { this.data = raw }}
                        />
                        <SpinnerButton title='Match.SaveComments' onPress={this.saveButtonHandler} style={GlobalStyles.NextButton} loading={store.loading} />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        )
    }
}

const style = StyleSheet.create({
    View: {
        flex: 1
    },
    ScrollContainer: {
        paddingBottom: 80
    },
    FormWrapper: {
        padding: 0
    },
    Intro: {
        marginBottom: 20
    }
});

export default inject('store')(observer(CloseRecord));

decorate(CloseRecord, {
    data: observable,
    adaptFormToStore: action
});