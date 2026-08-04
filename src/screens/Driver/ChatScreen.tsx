import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

type Message = {
    id: number;
    text: string;
    from: 'me' | 'them';
    time: string;
};

const initialMessages: Message[] = [
    {
        id: 1,
        text: 'Hi Andiswa, I am on my way to collect your laundry.',
        from: 'me',
        time: '10:02 AM',
    },
    {
        id: 2,
        text: 'Great! I have the bags ready on the front porch.',
        from: 'them',
        time: '10:05 AM',
    },
    {
        id: 3,
        text: 'Perfect, I will let you know when I arrive.',
        from: 'me',
        time: '10:06 AM',
    },
];

const CONTACT_NAME = 'Andiswa Gumede';
const CONTACT_STATUS = 'Online';

export default function ChatScreen() {
    const [messages, setMessages] =
        useState<Message[]>(initialMessages);
    const [input, setInput] = useState('');

    const getCurrentTime = () => {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const suffix = hours >= 12 ? 'PM' : 'AM';

        hours = hours % 12 || 12;

        return `${hours}:${minutes} ${suffix}`;
    };

    const sendMessage = () => {
        const text = input.trim();

        if (!text) {
            return;
        }

        setMessages((prev) => [
            ...prev,
            {
                id: prev.length + 1,
                text,
                from: 'me',
                time: getCurrentTime(),
            },
        ]);
        setInput('');
    };

    return (
        <SafeAreaView style={styles.safeArea}>

            {/* Header */}
            <View style={styles.header}>

                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        {CONTACT_NAME.charAt(0)}
                    </Text>
                </View>

                <View style={styles.headerInfo}>

                    <Text style={styles.headerName}>
                        {CONTACT_NAME}
                    </Text>

                    <Text style={styles.headerStatus}>
                        {CONTACT_STATUS}
                    </Text>

                </View>

            </View>

            {/* Messages */}
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={0}
            >

                <ScrollView
                    style={styles.flex}
                    contentContainerStyle={styles.messagesContainer}
                    ref={(ref) => {
                        ref?.scrollToEnd({ animated: false });
                    }}
                >

                    {messages.map((message) => {
                        const isMine = message.from === 'me';

                        return (
                            <View
                                key={message.id}
                                style={[
                                    styles.messageRow,
                                    isMine
                                        ? styles.messageRowMine
                                        : styles.messageRowTheirs,
                                ]}
                            >
                                <View
                                    style={[
                                        styles.bubble,
                                        isMine
                                            ? styles.bubbleMine
                                            : styles.bubbleTheirs,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.messageText,
                                            isMine
                                                ? styles.messageTextMine
                                                : styles.messageTextTheirs,
                                        ]}
                                    >
                                        {message.text}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.messageTime,
                                            isMine
                                                ? styles.messageTimeMine
                                                : styles.messageTimeTheirs,
                                        ]}
                                    >
                                        {message.time}
                                    </Text>
                                </View>
                            </View>
                        );
                    })}

                </ScrollView>

                {/* Input Bar */}
                <View style={styles.inputBar}>

                    <TextInput
                        style={styles.input}
                        placeholder="Type a message..."
                        placeholderTextColor="#8E8E93"
                        value={input}
                        onChangeText={setInput}
                        multiline
                        onSubmitEditing={sendMessage}
                    />

                    <TouchableOpacity
                        style={styles.sendButton}
                        onPress={sendMessage}
                        disabled={!input.trim()}
                    >
                        <Ionicons
                            name="send"
                            size={18}
                            color="#FFFFFF"
                        />
                    </TouchableOpacity>

                </View>

            </KeyboardAvoidingView>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({

    safeArea: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },

    flex: {
        flex: 1,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#E8ECF1',
    },

    avatar: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#173D8F',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },

    avatarText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
    },

    headerInfo: {
        flex: 1,
    },

    headerName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#12263A',
    },

    headerStatus: {
        marginTop: 2,
        fontSize: 12,
        color: '#16A34A',
        fontWeight: '600',
    },

    messagesContainer: {
        padding: 16,
    },

    messageRow: {
        marginBottom: 12,
        flexDirection: 'row',
    },

    messageRowMine: {
        justifyContent: 'flex-end',
    },

    messageRowTheirs: {
        justifyContent: 'flex-start',
    },

    bubble: {
        maxWidth: '78%',
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingVertical: 10,
    },

    bubbleMine: {
        backgroundColor: '#173D8F',
        borderBottomRightRadius: 4,
    },

    bubbleTheirs: {
        backgroundColor: '#FFFFFF',
        borderBottomLeftRadius: 4,
        elevation: 1,
    },

    messageText: {
        fontSize: 14,
        lineHeight: 20,
    },

    messageTextMine: {
        color: '#FFFFFF',
    },

    messageTextTheirs: {
        color: '#12263A',
    },

    messageTime: {
        marginTop: 4,
        fontSize: 10,
        alignSelf: 'flex-end',
    },

    messageTimeMine: {
        color: '#C9D6F0',
    },

    messageTimeTheirs: {
        color: '#8E8E93',
    },

    inputBar: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#E8ECF1',
    },

    input: {
        flex: 1,
        backgroundColor: '#F1F3F6',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 10,
        maxHeight: 100,
        fontSize: 14,
        color: '#12263A',
    },

    sendButton: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#173D8F',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },

});
