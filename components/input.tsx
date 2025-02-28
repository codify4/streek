import { TextInput } from 'react-native'

type InputProps = {
    mode: 'outlined' | 'flat'
    value: string
    onChangeText: (text: string) => void
    placeholder: string | undefined
    focus?: boolean
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'ascii-capable' | 'numbers-and-punctuation' | 'url' | 'number-pad' | 'name-phone-pad' | 'decimal-pad' | 'twitter' | 'web-search'
    moreStyles?: object
}

const Input = ({ mode, value, onChangeText, placeholder, focus, keyboardType, moreStyles }: InputProps) => {
    return (
        <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#9ca3af"
            placeholderClassName='font-poppins'
            style={{ 
                height: 60, 
                borderRadius: 15, 
                padding: 10, 
                backgroundColor: mode === 'outlined' ? '#fff' : '#1f2937', 
                borderWidth: mode === 'outlined' ? 1 : 0, 
                borderColor: mode === 'outlined' ? '#9ca3af' : '#fff',
                ...moreStyles 
            }}
            autoFocus={focus ? true : false}
            keyboardType={keyboardType}
        />
    )
}
export default Input