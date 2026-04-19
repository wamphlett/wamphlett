import styles from './aspectRatioBox.module.css';

export default function AspectRatioBox({ aspectRatio=1, borderRadius=0, children }) {
    return (
        <div className={styles.box} style={{
            paddingBottom: 100/aspectRatio + "%",
            borderRadius: borderRadius,
        }}>
            <div className={styles.content}>
                {children}
            </div>
        </div>
    );
}