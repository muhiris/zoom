import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import React, { useEffect, useState } from 'react'
import Button from '../components/Button'
import Button2 from '../components/Button2'
import { createSubscription } from '../redux/slice/subscription/subscriptionAction';
import { createPaymentIntent } from '../redux/slice/stripe/stripeAction';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toast';
import { loadStripe } from '@stripe/stripe-js';
import rightImage from "../assets/humanSignin.png";


const StripePaymentElementForm = ({ plan, clientSecret }) => {

    const dispatch = useDispatch();
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const { loading: subscriptionLoading, subscription, error: subscriptionError, success: subscriptionSuccess } = useSelector(state => state.subscription);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        if (!stripe || !elements) {
            // Stripe.js hasn't yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }


        const { error } = await stripe.confirmPayment({
            elements,
            redirect: "if_required"
        });

        setLoading(false);
        if (error) {
            // This point will only be reached if there is an immediate error when
            // confirming the payment. Show error to your customer (for example, payment
            // details incomplete)
            toast.error(error.message);
        } else {
            dispatch(createSubscription({ plan: plan._id, planType: plan.planType, paymentStatus: "paid" })).then((res) => {
                if (createSubscription.fulfilled.match(res)) {
                    toast.success("Subscription created successfully");
                }
            });

        }
    }



    return (

        <div className="overflow-hidden h-[100vh] flex items-center justify-center lg:justify-between ">
            <div className="flex-start flex-col lg:ml-40  lg:min-w-[30%]  ">
                <div>
                    <h1 className="text-4xl font-medium text-gray-900">{plan.title||"Custom Plan"}</h1>
                    <p className="font-semibold text-xl text-gray-600 mb-3">
                        ${plan.price}
                    </p>
                </div>

                <form
                    className='className="flex flex-col w-full'
                    onSubmit={handleSubmit}>

                    <PaymentElement />
                    <div className='w-full flex flex-row items-center gap-3'>
                        <Button
                            style={{
                                backgroundColor: "#c7cfe0",
                                bordeWidth: 0,
                                marginTop: 20,
                                flex: 1,
                                borderRadius: "10px",
                            }}
                            disabled={subscriptionLoading||loading}
                            textStyle={{ color: "#0B5CFF" }} text={"Cancel"}
                            onClick={() => navigate(-1)}
                        />

                        <Button style={{
                            color: "white",
                            marginTop: 20,
                            borderRadius: "10px",
                            flex: 1

                        }} loading={subscriptionLoading||loading} text="Pay" type={"Submit"} />

                    </div>
                </form>
            </div>

            <img src={rightImage} alt="" className="w-[50vw] hidden lg:block" />
        </div>


    );
}

const stripePromise = loadStripe('pk_test_51N9VKCCuJny4nYa1FvVEfLlOGduPvpibv1Lh11xlzaj2fL71wmLGUvZMAvJTBKi0MSxc2Kk2zpZNUtJ8a3kk50gR0025dhrSAJ');

const StripePaymentElement = () => {

    const [options, setOptions] = useState({});
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { state } = useLocation();
    const { plan, clientSecret, ephemeralKey, customer } = state;

    console.log(plan, "plan");

    return (
        <div className=''>
            {clientSecret ?

                <Elements stripe={stripePromise} options={{ clientSecret }}>

                    <StripePaymentElementForm plan={plan} clientSecret={clientSecret, customer, ephemeralKey} />

                </Elements> :
                <p>Loading...</p>
            }
        </div>


    )
}



export default StripePaymentElement