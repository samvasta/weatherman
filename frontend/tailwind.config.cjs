const animatePlugin = require("tailwindcss-animate");
const ariaAttributesPlugin = require("tailwindcss-aria-attributes");
const radixPlugin = require("tailwindcss-radix");
const { fontFamily } = require("tailwindcss/defaultTheme");
const plugin = require("tailwindcss/plugin");

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./index.html"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",

      bAlpha: {
        [1]: "hsla(214, 11%, 25%, 0.012)",
        [2]: "hsla(214, 11%, 25%, 0.027)",
        [3]: "hsla(214, 11%, 25%, 0.047)",
        [4]: "hsla(214, 11%, 25%, 0.071)",
        [5]: "hsla(214, 11%, 25%, 0.090)",
        [6]: "hsla(214, 11%, 25%, 0.114)",
        [7]: "hsla(214, 11%, 25%, 0.141)",
        [8]: "hsla(214, 11%, 25%, 0.220)",
        [9]: "hsla(214, 11%, 25%, 0.439)",
        [10]: "hsla(214, 11%, 25%, 0.478)",
        [11]: "hsla(214, 11%, 25%, 0.565)",
        [12]: "hsla(214, 11%, 25%, 0.910)",
      },
      neutral: {
        [1]: "#fbfdfc",
        [2]: "#f7f9f8",
        [3]: "#eef1f0",
        [4]: "#e6e9e8",
        [5]: "#dfe2e0",
        [6]: "#d7dad9",
        [7]: "#cbcfcd",
        [8]: "#b8bcba",
        [9]: "#868e8b",
        [10]: "#7c8481",
        [11]: "#5f6563",
        [12]: "#1a211e",
      },
      primary: {
        [1]: "#fdfbfc",
        [2]: "#fbf8f9",
        [3]: "#f5ebf1",
        [4]: "#ebdbe5",
        [5]: "#f0dae8",
        [6]: "#ecc3dd",
        [7]: "#e39cca",
        [8]: "#ec73c2",
        [9]: "#f832b3",
        [10]: "#df0091",
        [11]: "#b30074",
        [12]: "#7f0052",
      },
      success: {
        [1]: "#f9fefb",
        [2]: "#f4fbf6",
        [3]: "#e7f5eb",
        [4]: "#dcf0e1",
        [5]: "#d2ebd7",
        [6]: "#c6e6ce",
        [7]: "#b6debe",
        [8]: "#9bd1a5",
        [9]: "#54b268",
        [10]: "#388545",
        [11]: "#0a5316",
        [12]: "#0f2b15",
      },

      danger: {
        [1]: "#fdfcfb",
        [2]: "#fbf7f5",
        [3]: "#f6edea",
        [4]: "#f2e2df",
        [5]: "#efd9d4",
        [6]: "#ebceca",
        [7]: "#e5c0b9",
        [8]: "#ED8373",
        [9]: "#F94D33",
        [10]: "#DF1E00",
        [11]: "#B41800",
        [12]: "#271612",
      },
      magic: {
        [1]: "#fbfcfd",
        [2]: "#f8f9fb",
        [3]: "#ebf1f5",
        [4]: "#dbe4eb",
        [5]: "#dae7f0",
        [6]: "#c3dcec",
        [7]: "#9cc7e3",
        [8]: "#73beec",
        [9]: "#32acf8",
        [10]: "#0089df",
        [11]: "#006eb3",
        [12]: "#004e7f",
      },
      data: {
        "a-light": "#f0b6fc",
        "a-dark": "#bb38d4",

        "b-light": "#d9b9fc",
        "b-dark": "#9642ee",

        "c-light": "#cfe4d1",
        "c-dark": "#71af77",

        "d-light": "#f2e1c3",
        "d-dark": "#d8a850",

        "e-light": "#f8d3c5",
        "e-dark": "#eb7f55",

        "f-light": "#fcb7d6",
        "f-dark": "#e33b87",
        sequence: {
          [1]: "#A1ECF3",
          [2]: "#69CBE7",
          [3]: "#4EA3E0",
          [4]: "#2d63b5",
          [5]: "#0c2fa4",
          [6]: "#00075a",
        },
      },
      "cur-scheme": {
        [12]: "var(--current-color-12)",
        [11]: "var(--current-color-11)",
        [10]: "var(--current-color-10)",
        [9]: "var(--current-color-9)",
        [8]: "var(--current-color-8)",
        [7]: "var(--current-color-7)",
        [6]: "var(--current-color-6)",
        [5]: "var(--current-color-5)",
        [4]: "var(--current-color-4)",
        [3]: "var(--current-color-3)",
        [1]: "var(--current-color-1)",
        [2]: "var(--current-color-2)",
      },
    },
    boxShadow: {
      sm: "0px 4px 16px -8px rgba(0, 0, 0, 0.25), 0px 0px 2px rgba(0, 0, 0, 0.25)",
      md: "0px 8px 16px -8px rgba(0, 0, 0, 0.25), 0px 0px 2px rgba(0, 0, 0, 0.25)",
      lg: "0px 16px 16px -8px rgba(0, 0, 0, 0.25), 0px 0px 2px rgba(0, 0, 0, 0.25)",
      xl: "0px 24px 16px -8px rgba(0, 0, 0, 0.25), 0px 0px 2px rgba(0, 0, 0, 0.25)",
    },
    dropShadow: {
      sm: `0px 4px 16px rgba(0, 0, 0, 0.25) 0px 0px 2px rgba(0, 0, 0, 0.25)`,

      md: `0px 8px 16px rgba(0, 0, 0, 0.25) 0px 0px 2px rgba(0, 0, 0, 0.25)`,

      lg: `0px 16px 16px rgba(0, 0, 0, 0.25) 0px 0px 2px rgba(0, 0, 0, 0.25)`,

      xl: `0px 24px 16px rgba(0, 0, 0, 0.25) 0px 0px 2px rgba(0, 0, 0, 0.25)`,
    },
    borderRadius: {
      none: "0",
      DEFAULT: "16px",
      sm: "8px",
      md: "16px",
      lg: "24px",
      full: "9999px",
    },

    extend: {
      fontFamily: {
        sans: ["Asap", ...fontFamily.sans],
        serif: ["Unna", ...fontFamily.serif],
        mono: ["Azeret Mono", ...fontFamily.mono],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1.5" }],
        sm: ["0.875rem", { lineHeight: "1.5" }],
        base: ["1rem", { lineHeight: "1.4" }],
        md: ["1rem", { lineHeight: "1.4" }],
        lg: ["1.25rem", { lineHeight: "1.325" }],
        xl: ["1.5rem", { lineHeight: "1.25" }],
        "2xl": ["2rem", { lineHeight: "1.2" }],
        "3xl": ["3rem", { lineHeight: "1.2" }],
        "4xl": ["4.5rem", { lineHeight: "1.2" }],
        "5xl": ["6.75rem", { lineHeight: "1.2" }],
      },
      lineHeight: {
        none: "1",
        tight: "1.25",
        snug: "1.325",
        normal: "1.5",
        relaxed: "1.625",
        loose: "2",
        3: ".75rem",
        4: "1rem",
        5: "1.25rem",
        6: "1.5rem",
        7: "1.75rem",
        8: "2rem",
        9: "2.25rem",
        10: "2.5rem",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      zIndex: {
        maxRegion: 12,
        edge: 15,
        edgeLabel: 16,
        overlay: 20,
        modal: 30,
        popover: 40,
        dropdown: 50,
        toast: 100,
        tooltip: 150,
      },
      borderWidth: {
        DEFAULT: "2px",
        0: "0",
        2: "2px",
        3: "3px",
        4: "4px",
        6: "6px",
        8: "8px",
      },
      spacing: {
        xcomfortable: "2rem",
        comfortable: "1.5rem",
        regular: "1rem",
        tight: "0.5rem",
        xtight: "0.25rem",
        "tight/2": "0.25rem",
        "xtight/2": "0.125",
      },
    },
  },
  plugins: [
    animatePlugin,
    radixPlugin,

    ariaAttributesPlugin,
    // @ts-ignore
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          // @ts-ignore
          scheme: (colorScheme) => ({
            "--current-color-1": theme(`colors.${colorScheme}.1`),
            "--current-color-2": theme(`colors.${colorScheme}.2`),
            "--current-color-3": theme(`colors.${colorScheme}.3`),
            "--current-color-4": theme(`colors.${colorScheme}.4`),
            "--current-color-5": theme(`colors.${colorScheme}.5`),
            "--current-color-6": theme(`colors.${colorScheme}.6`),
            "--current-color-7": theme(`colors.${colorScheme}.7`),
            "--current-color-8": theme(`colors.${colorScheme}.8`),
            "--current-color-9": theme(`colors.${colorScheme}.9`),
            "--current-color-10": theme(`colors.${colorScheme}.10`),
            "--current-color-11": theme(`colors.${colorScheme}.11`),
            "--current-color-12": theme(`colors.${colorScheme}.12`),
          }),
        },
        {
          type: "lookup",
          values: {
            neutral: "neutral",
            primary: "primary",
            danger: "danger",
            success: "success",
            magic: "magic",
          },
        }
      );
    }),
    // @ts-ignore
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".text-balance": {
          textWrap: "balance",
        },
      });
    }),
  ],
};
