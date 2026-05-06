import { motion } from 'framer-motion';

/** Skeleton shimmer block */
const Skeleton = ({ className = '', style = {} }) => (
  <div className={`skeleton ${className}`} style={style} />
);

/** Full validation-rule card skeleton */
export function RuleCardSkeleton() {
  return (
    <motion.div
      className="glass p-5 flex flex-col gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex items-center justify-between">
        <Skeleton style={{ width: '55%', height: 18 }} />
        <Skeleton style={{ width: 44, height: 24, borderRadius: 999 }} />
      </div>
      <Skeleton style={{ width: '80%', height: 14 }} />
      <Skeleton style={{ width: '60%', height: 14 }} />
      <div className="flex gap-2 mt-2">
        <Skeleton style={{ width: 80, height: 32, borderRadius: 8 }} />
        <Skeleton style={{ width: 80, height: 32, borderRadius: 8 }} />
      </div>
    </motion.div>
  );
}

/** Dashboard stat card skeleton */
export function StatCardSkeleton() {
  return (
    <div className="glass p-5 flex flex-col gap-3">
      <Skeleton style={{ width: '40%', height: 14 }} />
      <Skeleton style={{ width: '60%', height: 32 }} />
    </div>
  );
}

export default Skeleton;
