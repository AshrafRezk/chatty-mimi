
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  securityToken: z.string().min(1, "Security token is required"),
  isSandbox: z.boolean().default(false),
});

const SalesforceUserPassAuth = () => {
  const { user } = useAuth();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      securityToken: "",
      isSandbox: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (!user) {
        toast.error("You must be logged in to add Salesforce credentials");
        return;
      }

      // Insert credentials into database
      const { error } = await supabase
        .from('salesforce_auth')
        .insert({
          user_id: user.id,
          username: values.username,
          password: values.password,
          security_token: values.securityToken,
          is_sandbox: values.isSandbox,
        });

      if (error) {
        if (error.code === '23505') { // Unique violation
          toast.error("These credentials already exist for your account");
        } else {
          toast.error("Failed to save credentials");
        }
        return;
      }

      toast.success("Salesforce credentials added successfully");
      form.reset();
    } catch (error) {
      toast.error("An error occurred while saving credentials");
      console.error("Error:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Add Salesforce Credentials</h2>
        <p className="text-sm text-muted-foreground">
          Enter your Salesforce username, password, and security token to connect to your org.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="your.email@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Enter your password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="securityToken"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Security Token</FormLabel>
                <FormControl>
                  <Input placeholder="Your Salesforce security token" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isSandbox"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Input 
                    type="checkbox" 
                    checked={field.value} 
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="w-4 h-4"
                  />
                </FormControl>
                <FormLabel className="!mt-0">This is a sandbox org</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Add Credentials
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SalesforceUserPassAuth;
