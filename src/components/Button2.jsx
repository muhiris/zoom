import React from 'react'
import Loading from './Loading'

const Button2 = ({
    style,
    ICON,
    text,
    onClick,
    transparent,
    textStyle,
    loading = false,
    disabled = false,
    loaderColor,
    type
}) => {
    return (
        <button
            type={type || "button"}
            disabled={loading || disabled} onClick={onClick || null}
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 10,
                borderRadius: 20,
                marginVertical: 5,
                borderWidth: 1,
                backgroundColor: !transparent ? "#0B5CFF" : 'transparent', borderColor: !transparent ? "#0B5CFF" : '#EEEEEE', ...style
            }}
        >
            {ICON && !loading && <ICON />}
            {(text && !loading) && <p
                style={{
                    fontSize: 16,
                    fontWeight: '600', color: transparent ? "#212121" : "#fff", marginHorizontal: ICON ? 10 : 0, ...textStyle
                }}
            >{text}</p>}
            {loading &&
                <Loading color={loaderColor || "#fff"} />
            }
        </button>
    )
}

export default Button2

