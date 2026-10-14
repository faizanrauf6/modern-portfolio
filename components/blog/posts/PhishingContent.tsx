'use client';

import { ShieldCheck, Database, Scissors, BrainCog, SlidersHorizontal, ClipboardCheck, Server, Workflow, FileSearch } from 'lucide-react';
import BlogShell from '@/components/blog/BlogShell';
import PipelineDiagram from '@/components/blog/PipelineDiagram';
import { H2, H3, P, UL, LI, Code, Pre, Callout, CompareGrid } from '@/components/blog/Prose';

const STEPS = [
  { icon: Database, title: 'Audit data', tag: 'What was known?', detail: 'Record collection times, label provenance, and duplicate or campaign relationships. Use only features that would have existed when a real prediction was made.' },
  { icon: Scissors, title: 'Split', tag: 'Before training', detail: 'Hold out a later time window. Use earlier data for training and validation, and audit domain or campaign overlap so repeated examples cannot inflate the result.' },
  { icon: BrainCog, title: 'Fit', tag: 'Training only', detail: 'Fit preprocessing and the classifier on the training partition. Vocabulary, imputers, scaling, and feature selection must not learn from the held-out data.' },
  { icon: SlidersHorizontal, title: 'Choose threshold', tag: 'Validation only', detail: 'Compare precision, recall, and false-positive volume on validation data. Pick the operating threshold using the product’s review capacity and error costs.' },
  { icon: ClipboardCheck, title: 'Test once', tag: 'Frozen policy', detail: 'Evaluate the fixed model and threshold on the untouched later window. Report raw counts, uncertainty, and performance slices alongside aggregate metrics.' },
];

export default function PhishingContent() {
  return (
    <BlogShell category="Machine Learning" icon={ShieldCheck}
      title={<>A phishing detector, <span className="text-accent">beyond accuracy.</span></>}
      subtitle="Build an evaluation you can explain: realistic splits, precision and recall, leakage checks, and a threshold matched to the cost of mistakes."
      readTime="8 min read" author="Muhammad Faizan Rauf"
      more={[
        { href: '/blog/serving-python-ml-models-with-nestjs', title: 'Serving ML Models', icon: Server },
        { href: '/blog/building-reliable-ai-automation', title: 'Reliable Automation', icon: Workflow },
        { href: '/blog/how-rag-works', title: 'How RAG Works', icon: FileSearch },
      ]}>
      <P>A phishing classifier reports 99% accuracy. That sounds impressive until you learn that only 1% of the evaluation set is phishing. A classifier that marks every example as benign also reaches 99%, while catching no attacks at all.</P>
      <P>The question is more specific than whether the model is “accurate.” How many harmful URLs does it catch? How many legitimate links does it interrupt? Were the test examples actually new? This walkthrough uses hypothetical numbers to explain the method; it reports no measured result from a deployed detector.</P>
      <Callout title="Define the decision first">A warning banner, an analyst review queue, and automatic blocking have different error costs. Choose the evaluation and threshold for the action the model will drive.</Callout>

      <H2 id="confusion-matrix">Start with the four counts</H2>
      <P>Call phishing the positive class. A true positive is a phishing example correctly flagged; a false positive is a benign example flagged by mistake. A false negative is a missed phishing example, and a true negative is a benign example correctly left alone.</P>
      <div className="my-7 overflow-x-auto rounded-2xl border border-primary/10">
        <table className="w-full text-sm text-left text-text/75">
          <caption className="p-4 text-left font-medium text-primary">Hypothetical test set: 10,000 URLs, including 100 phishing URLs</caption>
          <thead className="bg-primary/5"><tr><th scope="col" className="p-4">Actual label</th><th scope="col" className="p-4">Flagged</th><th scope="col" className="p-4">Allowed</th></tr></thead>
          <tbody><tr className="border-t border-primary/10"><th scope="row" className="p-4 font-medium">Phishing</th><td className="p-4">80 true positives</td><td className="p-4">20 false negatives</td></tr><tr className="border-t border-primary/10"><th scope="row" className="p-4 font-medium">Benign</th><td className="p-4">99 false positives</td><td className="p-4">9,801 true negatives</td></tr></tbody>
        </table>
      </div>
      <P>Precision is <Code>TP / (TP + FP)</Code>: here, about 44.7% of flagged URLs are phishing. Recall is <Code>TP / (TP + FN)</Code>: the detector finds 80% of phishing URLs. The false-positive rate is <Code>FP / (FP + TN)</Code>, or 1%. Accuracy is still 98.81%. See the <a href="https://scikit-learn.org/stable/modules/model_evaluation.html" className="underline">scikit-learn metric definitions</a> for these measures and precision-recall curves.</P>
      <P>That 1% false-positive rate creates 99 incorrect flags because benign traffic dominates. A test set with artificially balanced classes can hide this workload. Keep the expected deployment prevalence visible, and report raw counts so someone can translate rates into the number of users affected.</P>

      <H2 id="evaluation-pipeline">A split that resembles the future</H2>
      <P>Use the diagram to follow the evaluation gates. Choosing the partition is part of the experiment, not a housekeeping task after training.</P>
      <PipelineDiagram steps={STEPS} />
      <H3>1. Separate time from randomness</H3>
      <P>A random split can place near-identical URLs from the same campaign in both training and testing. It may also let the model learn from tomorrow’s examples to predict yesterday’s. For a detector that will score future traffic, reserve a later collection window as the final test set and validate on a window before it.</P>
      <P>The <a href="https://scikit-learn.org/stable/modules/cross_validation.html" className="underline">cross-validation guide</a> explains why ordinary shuffled folds can be unsuitable for time-dependent data, and describes group-aware evaluation. My recommendation for phishing data is to audit both time and campaign relationships: they answer different generalization questions.</P>
      <P>Report performance on all future traffic and, when useful, a separate slice of previously unseen domains or campaigns. Do not quietly remove familiar domains and describe that result as ordinary traffic performance. If a group crosses the time boundary, make your handling explicit and preserve chronological order.</P>
      <H3>2. Use features that existed at prediction time</H3>
      <P>A domain’s reputation from a threat feed collected a week after the attack may almost reveal the answer. A label embedded in the source filename is an even simpler leak. For every feature, ask when it became available and whether the production service can obtain it before making the decision.</P>
      <P>Keep timestamps for both observations and labels. A phishing label discovered later may be valid ground truth, but a later reputation value cannot be smuggled into an earlier prediction. Audit label provenance, conflicting labels, repeated URLs, and source-specific collection artifacts before comparing algorithms.</P>
      <H3>3. Fit preprocessing inside the boundary</H3>
      <P>Fit imputers, scalers, text vocabularies, feature selectors, and any resampling only on training data. Apply the fitted transformations to validation and testing. Scikit-learn’s <a href="https://scikit-learn.org/stable/common_pitfalls.html" className="underline">data-leakage guidance</a> recommends pipelines to keep learned preprocessing attached to the model during evaluation.</P>
      <Pre filename="evaluation.py" language="python">{`from sklearn.pipeline import make_pipeline
from sklearn.impute import SimpleImputer
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import confusion_matrix, precision_score, recall_score

# X_* contain numeric features available at observation time.
# Partitions are already chronological and audited for duplicates.
pipeline = make_pipeline(
    SimpleImputer(strategy="median"),
    RandomForestClassifier(n_estimators=200, random_state=42),
)
pipeline.fit(X_train, y_train)

# Choose this value using validation data, then freeze it.
threshold = selected_validation_threshold
positive_column = list(pipeline.classes_).index(1)
scores = pipeline.predict_proba(X_test)[:, positive_column]
predictions = (scores >= threshold).astype(int)
print(confusion_matrix(y_test, predictions, labels=[0, 1]))
print(precision_score(y_test, predictions, zero_division=0))
print(recall_score(y_test, predictions, zero_division=0))`}</Pre>
      <P>The variable names represent partitions prepared before this snippet. This is an evaluation skeleton, not a dataset loader or a claim that random forests are the best detector. Compare it against a simple baseline using the same partitions and operating constraint.</P>

      <H2 id="threshold">The threshold is a product choice</H2>
      <CompareGrid left={{ title: 'Analyst review', icon: ClipboardCheck, points: ['Prioritize useful findings per reviewer hour', 'Track daily alert volume', 'Measure precision among reviewed alerts', 'Account for delayed and incomplete labels'] }} right={{ title: 'Automatic blocking', icon: ShieldCheck, points: ['Set a strict false-positive budget', 'Check impact on legitimate users', 'Provide an appeal or override path', 'Consider a separate uncertain/review band'] }} />
      <P>Choose the threshold on validation data using an explicit constraint, such as a maximum benign-block rate. Then freeze both the model and threshold before evaluating the final test window. If you change either after seeing the result, you have used the test set for selection and need a fresh holdout.</P>
      <Callout type="warning" title="A score is not automatically a probability">An output of 0.9 does not prove a 90% chance of phishing. Check calibration separately if decisions depend on probability estimates, and avoid presenting an uncalibrated score as certainty.</Callout>

      <H2 id="reporting">Make the result useful after deployment</H2>
      <P>Publish the dates, class counts, collection sources, positive-label definition, threshold, confusion matrix, precision, recall, and false-positive rate. Include uncertainty intervals where the sample supports them; correlated campaign examples should not be treated as thousands of independent observations.</P>
      <UL>
        <LI><strong>Slice the errors:</strong> inspect new domains, shortened URLs, languages, sources, and missing-feature cases. A good average can hide a poor experience for one traffic segment.</LI>
        <LI><strong>Measure the whole service:</strong> latency and feature-extraction failures affect real coverage. A URL that times out is not a confirmed benign URL.</LI>
        <LI><strong>Keep learning from later windows:</strong> track alert volume and labeled outcomes over time. Reevaluate a replacement model on a new holdout before changing the blocking policy.</LI>
      </UL>
      <P>A credible detector report explains what the system caught, what it missed, and what the mistakes cost. That is a stronger engineering result than a large accuracy percentage without a defensible experiment behind it.</P>
    </BlogShell>
  );
}
