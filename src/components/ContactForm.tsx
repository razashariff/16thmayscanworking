
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';

const formSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  personName: z.string().min(2, "Name must be at least 2 characters"),
  position: z.string().min(2, "Position must be at least 2 characters"),
  companyEmail: z.string().email("Invalid email address"),
  enquiryDetails: z.string().min(10, "Please provide more details about your enquiry"),
});

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      personName: "",
      position: "",
      companyEmail: "",
      enquiryDetails: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([{
          company_name: values.companyName,
          person_name: values.personName,
          position: values.position,
          company_email: values.companyEmail,
          enquiry_details: values.enquiryDetails,
        }]);

      if (error) throw error;

      navigate('/contact/thank-you');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem submitting your form. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto">
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input placeholder="Your company name" className="bg-cyber-dark/50 border-cyber-blue/30" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="personName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Name</FormLabel>
              <FormControl>
                <Input placeholder="Your full name" className="bg-cyber-dark/50 border-cyber-blue/30" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="position"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Position</FormLabel>
              <FormControl>
                <Input placeholder="Your position" className="bg-cyber-dark/50 border-cyber-blue/30" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="companyEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="your@company.com" className="bg-cyber-dark/50 border-cyber-blue/30" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="enquiryDetails"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enquiry Details</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Please provide details about your enquiry" 
                  className="bg-cyber-dark/50 border-cyber-blue/30 min-h-[120px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-cyber-blue to-cyber-purple hover:from-cyber-purple hover:to-cyber-blue"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Enquiry'}
        </Button>
      </form>
    </Form>
  );
};

export default ContactForm;
