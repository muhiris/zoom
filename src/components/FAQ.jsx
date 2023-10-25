import React from "react";
import FAQItem from "./FAQItem";
function FAQ() {
  return (
    <>
      <h1 className="text-3xl font-medium text-center mt-24 mb-6">
        Frequently Asked Questions
      </h1>
      <p className="text-xl text-center mb-20">
        Everything you need to know about the product and billing.
      </p>
      <div className="mb-20 flex flex-col items-center justify-center">
        <FAQItem
          question={"Is there a free trial available?"}
          answer={
            "Yes, you can try us for free for 30 days. If you want, we’ll provide you with a free, personalized 30-minute onboarding call to get you up and running as soon as possible."
          }
        />
        <FAQItem
          question={"Can I change my plan later?"}
          answer={
            "Yes, you can try us for free for 30 days. If you want, we’ll provide you with a free, personalized 30-minute onboarding call to get you up and running as soon as possible."
          }
        />
        <FAQItem
          question={"What is your cancellation policy?"}
          answer={
            "Yes, you can try us for free for 30 days. If you want, we’ll provide you with a free, personalized 30-minute onboarding call to get you up and running as soon as possible."
          }
        />
        <FAQItem
          question={"Can other info be added to an invoice?"}
          answer={
            "Yes, you can try us for free for 30 days. If you want, we’ll provide you with a free, personalized 30-minute onboarding call to get you up and running as soon as possible."
          }
        />
        <FAQItem
          question={"How does billing work?"}
          answer={
            "Yes, you can try us for free for 30 days. If you want, we’ll provide you with a free, personalized 30-minute onboarding call to get you up and running as soon as possible."
          }
        />
        <FAQItem
          question={"How do I change my account email?"}
          answer={
            "Yes, you can try us for free for 30 days. If you want, we’ll provide you with a free, personalized 30-minute onboarding call to get you up and running as soon as possible."
          }
        />
      </div>
    </>
  );
}

export default FAQ;
