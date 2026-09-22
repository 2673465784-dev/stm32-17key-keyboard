# MCU name
MCU = STM32F103

# Bootloader selection
BOOTLOADER = stm32duino




BOOTMAGIC_ENABLE = yes	# Virtual DIP switch configuration
MOUSEKEY_ENABLE = yes	# Mouse keys

EXTRAKEY_ENABLE = yes	# Audio control and System control

CONSOLE_ENABLE = no	# Console for debug
COMMAND_ENABLE = no    # Commands for debug and configuration

SLEEP_LED_ENABLE = yes  # Breathing sleep LED during USB suspend
NKRO_ENABLE = yes	    # USB Nkey Rollover

BACKLIGHT_ENABLE = no
RGBLIGHT_ENABLE = no


RGB_MATRIX_ENABLE = yes #RGB MATRIX
RGB_MATRIX_DRIVER = WS2812 #RGB MATRIX
WS2812_DRIVER = pwm #RGB DIVER





