import styles from './ClassroomBackdrop.module.css';

/** Original flat SVG scenery. Only the anatomical subject in front is 3D. */
export default function ClassroomBackdrop() {
  return <div className={styles.room} aria-hidden="true">
    <svg viewBox="0 0 1600 1050" preserveAspectRatio="xMidYMid slice" focusable="false">
      <defs>
        <linearGradient id="classroom-wall" x1="0" x2="1"><stop stopColor="#f5f3e9" /><stop offset=".55" stopColor="#fcfbf6" /><stop offset="1" stopColor="#f4f0e5" /></linearGradient>
        <linearGradient id="classroom-floor" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#eee9da" /><stop offset="1" stopColor="#f6f3e9" /></linearGradient>
        <linearGradient id="classroom-light" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff6c7" stopOpacity=".58" /><stop offset="1" stopColor="#fff7d2" stopOpacity="0" /></linearGradient>
      </defs>
      <rect width="1600" height="1050" fill="url(#classroom-wall)" />
      <path d="M0 752H1600V1050H0Z" fill="url(#classroom-floor)" />
      <path d="M0 752H1600" stroke="#dfd8c6" strokeWidth="2" />
      <path d="M800 754 50 1050M800 754 470 1050M800 754 1130 1050M800 754 1550 1050M0 878H1600M0 994H1600" stroke="#e5decc" strokeWidth="1" opacity=".47" />
      <g opacity=".8">
        <rect x="59" y="110" width="239" height="450" rx="5" fill="#ebe7d8" />
        <rect x="70" y="122" width="217" height="425" rx="3" fill="#fffdfa" />
        <path d="M179 122V547M70 333H287" stroke="#ddd9ca" strokeWidth="9" />
        <path d="M70 546H289L1060 1049H581Z" fill="url(#classroom-light)" />
        <path d="M54 563H306" stroke="#d5d0bf" strokeWidth="12" strokeLinecap="round" />
      </g>
      <g opacity=".53">
        <rect x="1120" y="175" width="339" height="297" rx="4" fill="#e3ddca" />
        <rect x="1130" y="184" width="320" height="276" fill="#fffdf6" />
        <path d="M1148 442H1430" stroke="#d9d2be" strokeWidth="3" />
        <text x="1160" y="218" fontFamily="Arial,sans-serif" fontSize="14" fill="#8a8978">Observer. Comprendre. Explorer.</text>
        <g fill="none" stroke="#c4b37a" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1226 264c-12-10-30-3-32 15-2 17 18 33 32 45 15-13 35-31 31-47-4-16-20-22-31-13Z" />
          <path d="M1216 271v-20m10 20v-26m10 28 4-22m-21 32 10 14-8 15" />
          <path d="M1334 258v75m0-54c-17-18-34 8-34 35 0 17 10 20 27 14v-35m8-14c17-18 34 8 34 35 0 17-10 20-27 14v-35" />
          <path d="M1188 374h205m-205 15h125m-125 15h174" stroke="#d0cab7" />
        </g>
        <text x="1205" y="351" fontFamily="Arial,sans-serif" fontSize="10" fill="#9c9984">Cœur</text>
        <text x="1314" y="351" fontFamily="Arial,sans-serif" fontSize="10" fill="#9c9984">Poumons</text>
      </g>
      <g opacity=".52">
        <rect x="361" y="205" width="124" height="214" rx="2" fill="#efdfaa" />
        <rect x="367" y="211" width="112" height="202" fill="#fffdf4" />
        <text x="381" y="235" fill="#b1a77e" fontFamily="Arial,sans-serif" fontSize="10">LE CORPS HUMAIN</text>
        <g stroke="#c5baa0" strokeWidth="2" fill="none" strokeLinecap="round">
          <ellipse cx="423" cy="264" rx="12" ry="15" />
          <path d="M423 281v64m-18-49 18-11 18 11m-36 0-10 45m46-45 10 45m-28 4-14 42m14-42 14 42M405 298q18 13 36 0m-35 9q17 11 34 0m-32 9q15 9 30 0m-28 9q13 7 26 0" />
        </g>
      </g>
      <g opacity=".67">
        <path d="M0 865H337L417 902H0Z" fill="#ded6bd" />
        <path d="M0 902H417V918H0Z" fill="#cfc5a9" />
        <path d="M50 918v132m300-132 15 132" stroke="#ccc7b8" strokeWidth="11" />
        <path d="M1600 872H1323L1239 908H1600Z" fill="#ded6bd" />
        <path d="M1239 908H1600V924H1239Z" fill="#cfc5a9" />
        <path d="M1293 924l-12 126m228-126v126" stroke="#ccc7b8" strokeWidth="11" />
        <path d="M89 866h92l-13-8H101Z" fill="#f7f0d2" />
        <path d="M1425 870h67v-4h-67Z" fill="#f8f4e3" />
      </g>
      <g opacity=".55">
        <path d="M1018 706v-84m0 47c-18-34-34-23-22-9 8 9 16 9 22 9m0-21c20-31 33-15 18-4-7 5-13 5-18 4" stroke="#a7ad83" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M1000 697h37l-6 34h-25Z" fill="#cec2a5" />
        <path d="M985 734h65" stroke="#ded6c1" strokeWidth="6" />
      </g>
    </svg>
    <div className={styles.wash} />
  </div>;
}
