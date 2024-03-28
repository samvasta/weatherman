const animatePlugin = require("tailwindcss-animate");
const ariaAttributesPlugin = require("tailwindcss-aria-attributes");
const radixPlugin = require("tailwindcss-radix");
const { fontFamily } = require("tailwindcss/defaultTheme");
const plugin = require("tailwindcss/plugin");

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./**/*.html"],
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
        [1]: "#FCFBF8",
        [2]: "#F9F8F3",
        [3]: "#F6F5ED",
        [4]: "#F0EFE2",
        [5]: "#EAE9D7",
        [6]: "#E3E3CE",
        [7]: "#DAD9C5",
        [8]: "#D0CFBB",
        [9]: "#B0AFA0",
        [10]: "#9B9A93",
        [11]: "#8C8C8C",
        [12]: "#383E46",
        [13]: "#13181c",
      },
      primary: {
        [12]: "#193b2d",
        [11]: "#218358",
        [10]: "#2b9a66",
        [9]: "#30a46c",
        [8]: "#5bb98b",
        [7]: "#8eceaa",
        [6]: "#adddc0",
        [5]: "#c4e8d1",
        [4]: "#d6f1df",
        [3]: "#e6f6eb",
        [2]: "#f4fbf6",
        [1]: "#fbfefc",
      },

      danger: {
        [12]: "#9F2F36",
        [11]: "#BF3C45",
        [10]: "#E24C56",
        [9]: "#E8616A",
        [8]: "#E7999E",
        [7]: "#E8ABAF",
        [6]: "#EDBBBF",
        [5]: "#F2CBCF",
        [4]: "#F7DBDF",
        [3]: "#FCECEE",
        [2]: "#FEF6F7",
        [1]: "#FFFCFC",
      },

      warning: {
        [12]: "#9F8F36",
        [11]: "#BFAB15",
        [10]: "#DFDB26",
        [9]: "#E8E16A",
        [8]: "#E7E99E",
        [7]: "#E8EBAF",
        [6]: "#EDEBBF",
        [5]: "#F2FBCF",
        [4]: "#F7FBDF",
        [3]: "#FCFCEE",
        [2]: "#FEFEF7",
        [1]: "#FFFFFC",
      },

      success: {
        [12]: "#58902D",
        [11]: "#73B93D",
        [10]: "#7BC73F",
        [9]: "#8BD053",
        [8]: "#B1DF8C",
        [7]: "#BBE599",
        [6]: "#C5E8AB",
        [5]: "#D1EDBB",
        [4]: "#DDF2CB",
        [3]: "#E9F7DB",
        [2]: "#F3FCEC",
        [1]: "#FCFFFC",
      },
      info: {
        [12]: "#276BAC",
        [11]: "#3A83C7",
        [10]: "#4C9AE2",
        [9]: "#5CA4E7",
        [8]: "#A1C4E3",
        [7]: "#ABCBE8",
        [6]: "#BCD6ED",
        [5]: "#CDE1F2",
        [4]: "#DEECF7",
        [3]: "#E5F0FB",
        [1]: "#FCFCFF",
        [2]: "#ECF5FC",
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
      swatches: {
        red: "#EE6151",
        orange: "#F4A940",
        yellow: "#DFDB26",
        green: "#5BDE62",
        teal: "#42DDC5",
        blue: "#58DBF1",
        violet: "#5BA5F2",
        purple: "#8A70FA",
        pink: "#DC64E8",
        gray: "#969696",
        brown: "#875D36",
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
        overlay: "20",
        modal: "30",
        popover: "40",
        dropdown: "50",
        toast: "100",
        tooltip: "150",
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
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  plugins: [
    animatePlugin,
    radixPlugin,

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
            warning: "warning",
            success: "success",
            info: "info",
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
